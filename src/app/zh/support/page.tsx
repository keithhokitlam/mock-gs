import Link from "next/link";
import NavBar from "../../components/navbar";

export default function ChineseSupportPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-2xl px-4 py-12">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-3xl font-semibold text-zinc-900 font-beckman">
            支持
          </h1>
          <p className="mb-6 text-base leading-relaxed text-zinc-700">
            我们在这里支持你！如果你对账号、会员或访问权限有疑问，我们很乐意帮忙，也很期待听到你的声音。
          </p>
          <p className="mb-6 text-base leading-relaxed text-zinc-700">
            如果有哪里不太顺利，请联系{" "}
            <a href="mailto:support@grocery-share.com" className="text-[#2B6B4A] underline hover:text-[#1f4d35]">
              support@grocery-share.com
            </a>
          </p>
          <p className="mb-6 text-base leading-relaxed text-zinc-700">
            我们通常会在 24-48 小时内回复（工作日）。
          </p>
          <div className="text-base leading-relaxed text-zinc-700">
            <p className="mb-2 font-semibold text-zinc-900">快捷链接</p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <Link href="/zh/faq" className="text-[#2B6B4A] underline hover:text-[#1f4d35]">
                  常见问题
                </Link>
                — 常见问题答案，轻松查找
              </li>
              <li>
                <Link href="/zh/contact" className="text-[#2B6B4A] underline hover:text-[#1f4d35]">
                  联系我们
                </Link>
                — 我们很期待收到你的消息
              </li>
              <li>
                <Link href="/zh/home" className="text-[#2B6B4A] underline hover:text-[#1f4d35]">
                  忘记密码？
                </Link>
                — 请在登录页点击“忘记密码”按钮
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
