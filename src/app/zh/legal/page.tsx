import NavBar from "../../components/navbar";
import { getLegalSections } from "../../legal/load-legal";

export default function ChineseLegalPage() {
  const sections = getLegalSections();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm space-y-8">
          <div>
            <h1 className="mb-4 text-3xl font-semibold text-zinc-900 font-beckman">
              法律条款
            </h1>
            <p className="text-base leading-relaxed text-zinc-700">
              英文版本为这些文件的正式版本。其他语言的摘要或翻译仅供参考。
            </p>
          </div>
          <section id="legal-zh-cn" className="scroll-mt-28 border-t border-zinc-200 pt-10" lang="zh-CN">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">简体中文</h2>
            <div className="text-base leading-relaxed text-zinc-700 whitespace-pre-line">
              {sections.zhCn}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
