import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "../components/navbar";
import { getLegalSections } from "./load-legal";

export const metadata: Metadata = {
  title: "Legal",
  description:
    "Privacy policy, terms of service, consumer and commercial disclaimers for Grocery-Share.com.",
};

function LegalBlock({
  id,
  title,
  body,
}: {
  id: string;
  title: string;
  body: string;
}) {
  return (
    <section id={id} className="scroll-mt-28 py-10 first:pt-0">
      <h2 className="text-xl font-semibold text-zinc-900 mb-4">{title}</h2>
      <div className="text-base leading-relaxed text-zinc-700 whitespace-pre-line">{body}</div>
    </section>
  );
}

type LegalLocale = "en" | "zh";

function LegalPageContent({ locale = "en" }: { locale?: LegalLocale }) {
  const s = getLegalSections();
  const isZh = locale === "zh";

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm space-y-8">
          <div>
            <h1 className="mb-4 text-3xl font-semibold text-zinc-900 font-beckman">
              {isZh ? "法律条款" : "LEGAL"}
            </h1>
            <p className="text-base leading-relaxed text-zinc-700">
              {isZh
                ? "英文版本为这些文件的正式版本。其他语言的摘要或翻译仅供参考。"
                : "The English version of these documents is the controlling version. Summaries or translations in other languages are provided for convenience only."}
            </p>
          </div>

          {!isZh && (
            <nav
            className="rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-sm leading-relaxed text-zinc-800"
            aria-label="On this page"
          >
            <p className="font-semibold text-zinc-900 mb-2">On this page</p>
            <ul className="list-disc space-y-1.5 pl-5 marker:text-zinc-400">
              <li>
                <Link href="#privacy-policy" className="text-[#2B6B4A] underline hover:no-underline">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="#terms-of-service" className="text-[#2B6B4A] underline hover:no-underline">
                  Terms of service
                </Link>
              </li>
              <li>
                <Link
                  href="#disclaimer-consumer"
                  className="text-[#2B6B4A] underline hover:no-underline"
                >
                  Disclaimer (consumer section)
                </Link>
              </li>
              <li>
                <Link
                  href="#disclaimer-commercial"
                  className="text-[#2B6B4A] underline hover:no-underline"
                >
                  Disclaimer (commercial section)
                </Link>
              </li>
              <li>
                <Link href="#legal-zh-cn" className="text-[#2B6B4A] underline hover:no-underline">
                  简体中文
                </Link>
              </li>
              <li>
                <Link href="#legal-zh-tw" className="text-[#2B6B4A] underline hover:no-underline">
                  繁體中文
                </Link>
              </li>
            </ul>
            <p className="mt-3 text-xs text-zinc-500">
              Source PDF:{" "}
              <Link
                href="/legal/Legal%20Perspectives%2020260415.docx.pdf"
                className="text-[#2B6B4A] underline hover:no-underline"
              >
                Legal Perspectives 20260415 (PDF)
              </Link>
            </p>
          </nav>
          )}

          {isZh ? (
            <section id="legal-zh-cn" className="scroll-mt-28 border-t border-zinc-200 pt-10" lang="zh-CN">
              <h2 className="text-xl font-semibold text-zinc-900 mb-4">简体中文</h2>
              <div className="text-base leading-relaxed text-zinc-700 whitespace-pre-line">{s.zhCn}</div>
            </section>
          ) : (
            <>
          <div className="divide-y divide-zinc-200">
            <LegalBlock id="privacy-policy" title="Privacy policy" body={s.privacy} />
            <LegalBlock id="terms-of-service" title="Terms of service" body={s.terms} />
            <LegalBlock
              id="disclaimer-consumer"
              title="Disclaimer for the consumer section"
              body={s.disclaimerConsumer}
            />
            <LegalBlock
              id="disclaimer-commercial"
              title="Disclaimer for the commercial section"
              body={s.disclaimerCommercial}
            />
          </div>

          <section id="legal-zh-cn" className="scroll-mt-28 border-t border-zinc-200 pt-10" lang="zh-CN">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">简体中文</h2>
            <div className="text-base leading-relaxed text-zinc-700 whitespace-pre-line">{s.zhCn}</div>
          </section>

          <section id="legal-zh-tw" className="scroll-mt-28 border-t border-zinc-200 pt-10" lang="zh-TW">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">繁體中文</h2>
            <div className="text-base leading-relaxed text-zinc-700 whitespace-pre-line">{s.zhTw}</div>
          </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function LegalPage() {
  return <LegalPageContent />;
}
