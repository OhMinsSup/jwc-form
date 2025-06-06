import { ExcelManager } from "@jwc/excel";
import { env } from "@jwc/payload/env";
import * as Sentry from "@sentry/nextjs";
import type { PayloadRequest } from "payload";

export const exportExcelEndpoints = async (request: PayloadRequest) => {
	try {
		const { docs } = await request.payload.find({
			collection: "forms",
			limit: 100,
			req: request,
		});

		const buffer = await ExcelManager.buildExcelFileBuffer(
			"청년부 연합 여름 수련회 참가자 명단",
			docs
		);

		const arrayBufferLike = new Uint8Array(buffer);

		return new Response(arrayBufferLike, {
			headers: {
				"Content-Type":
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				"Content-Disposition": 'attachment; filename="forms.xlsx"',
			},
		});
	} catch (error) {
		if (env.NODE_ENV === "development") {
			request.payload.logger.error(error);
		} else if (error instanceof Error) {
			Sentry.logger.error(error.message, {
				name: "exportExcelEndpoints",
				action: "endpoints",
			});
			Sentry.captureException(error, {
				tags: {
					name: "exportExcelEndpoints",
					action: "endpoints",
				},
			});
		}
		return new Response("Internal Server Error", {
			status: 500,
		});
	}
};
