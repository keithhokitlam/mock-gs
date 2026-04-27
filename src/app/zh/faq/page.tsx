"use client";

import Link from "next/link";
import { useState } from "react";
import NavBar from "../../components/navbar";

const faqData = [
  ["如何修改密码？", "在登录页点击“忘记密码”接收重置链接，或登录后点击右上角邮箱并选择“修改密码”。"],
  ["购买会员后可以退款吗？", "很抱歉，会员购买后无法退款。会员会自动续费（Alipay 除外）；你可以在账号菜单中停止未来续费。"],
  ["为什么我无法登录账号？", "请检查邮箱验证链接是否已点击、会员是否过期，或使用“忘记密码”重置密码。"],
  ["没有收到邮箱验证链接怎么办？", "请先检查垃圾邮件或广告邮件文件夹。仍未收到？请联系 support@grocery-share.com。"],
  ["会员有效期多久？", "每个会员方案提供 12 个月访问权限。银行卡支付会自动续费；Alipay 需要手动续费。"],
  ["支持哪些付款方式？", "我们支持 Visa、Mastercard、American Express 和 Alipay。"],
];

export default function ChineseFAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="mb-8 text-center text-3xl font-semibold text-zinc-900 font-beckman">
            常见问题
          </h1>
          <div className="space-y-4">
            {faqData.map(([question, answer], index) => (
              <div key={question} className="border-b border-zinc-200 last:border-b-0">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-[#2B6B4A]"
                >
                  <span className="text-lg font-semibold text-zinc-900">{question}</span>
                  <span className="text-zinc-500">{openIndex === index ? "▲" : "▼"}</span>
                </button>
                {openIndex === index && (
                  <p className="pb-4 text-base leading-relaxed text-zinc-700">{answer}</p>
                )}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-zinc-600">
            法律条款可在{" "}
            <Link href="/zh/legal" className="font-semibold text-[#2B6B4A] underline hover:no-underline">
              法律条款页面
            </Link>{" "}
            查看。
          </p>
        </div>
      </main>
    </div>
  );
}
