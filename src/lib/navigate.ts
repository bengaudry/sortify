"use server";
import { redirect } from "next/navigation";

export async function navigate (uri: string) {
  redirect(uri)
}