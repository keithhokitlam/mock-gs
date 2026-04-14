import { redirect } from "next/navigation";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

/** Legacy URL; login lives at /home (and /) */
export default async function CommercialHomeRedirect({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const err = sp.error;
  const errorParam = typeof err === "string" ? err : Array.isArray(err) ? err[0] : undefined;
  const suffix = errorParam ? `?error=${encodeURIComponent(errorParam)}` : "";
  redirect(`/home${suffix}`);
}
