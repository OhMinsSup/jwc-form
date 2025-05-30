import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

interface NodeServerEnv {
	NODE_ENV: "development" | "production" | "test";
	DATABASE_ENGINE: "postgres";
	DATABASE_URL: string;
	GOOGLE_CLIENT_EMAIL: string;
	GOOGLE_PRIVATE_KEY: string;
	GOOGLE_SHEET_ID: string;
	GOOGLE_SHEET_TITLE: string;
	AES_KEY: string;
	// Sentry Env
	SENTRY_AUTH_TOKEN?: string;
	SENTRY_PROJECT?: string;
	SENTRY_ORG?: string;
}

const isProduction = process.env.NODE_ENV === "production";

export const node = (): Readonly<NodeServerEnv> =>
	createEnv({
		server: {
			NODE_ENV: z
				.enum(["development", "production", "test"])
				.default("development"),
			DATABASE_ENGINE: z.enum(["postgres"]).default("postgres"),
			DATABASE_URL: z.string().url(),
			GOOGLE_CLIENT_EMAIL: z.string().min(1),
			GOOGLE_PRIVATE_KEY: z
				.string()
				.min(1)
				.transform((str) => str.split("\\n").join("\n")),
			AES_KEY: z.string().min(1),
			// Google Env
			GOOGLE_SHEET_ID: z.string().min(1),
			GOOGLE_SHEET_TITLE: z.string().min(1),
			// Sentry Env
			SENTRY_AUTH_TOKEN: isProduction
				? z.string().min(1, "Must be a non-empty string")
				: z.string().optional(),
			SENTRY_PROJECT: isProduction
				? z.string().min(1, "Must be a non-empty string")
				: z.string().optional(),
			SENTRY_ORG: isProduction
				? z.string().min(1, "Must be a non-empty string")
				: z.string().optional(),
		},
		// @ts-expect-error someting....
		runtimeEnv: process.env,
	});
