import NavBar from "../../components/navbar";

export default function ChineseContactPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-2xl px-4 py-12">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-3xl font-semibold text-zinc-900 font-beckman">
            联系我们
          </h1>
          <p className="mb-6 text-base leading-relaxed text-zinc-700">
            我们很期待收到你的消息！无论是问题、合作想法，还是反馈，都欢迎写给我们。我们洗耳恭听。
          </p>
          <div className="mb-6 space-y-4 text-base leading-relaxed text-zinc-700">
            <p className="font-semibold text-zinc-900">联系方式</p>
            <p>
              一般咨询：{" "}
              <a href="mailto:info@grocery-share.com" className="text-[#2B6B4A] underline hover:text-[#1f4d35]">
                info@grocery-share.com
              </a>
            </p>
            <p>
              技术支持：{" "}
              <a href="mailto:support@grocery-share.com" className="text-[#2B6B4A] underline hover:text-[#1f4d35]">
                support@grocery-share.com
              </a>
            </p>
          </div>
          <p className="text-base leading-relaxed text-zinc-700">
            我们通常会在 24-48 小时内回复（工作日）。期待与你联系！
          </p>
        </div>
      </main>
    </div>
  );
}
