import Link from "next/link";
import NavBar from "../../components/navbar";
import PricingPlanCards from "../../pricing/pricing-plan-cards";

export default function ChinesePricingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 font-beckman">价格方案</h1>
        </div>
        <PricingPlanCards locale="zh" />
        <div className="flex justify-center mt-8">
          <div className="max-w-md w-full">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>提示：</strong> 所有会员都会在到期日自动续费；通过 Alipay 支付的会员除外，Alipay 会员需要手动续费。
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center text-zinc-600">
          有问题？我们很乐意聊聊——{" "}
          <Link href="/zh/contact" className="text-[#2B6B4A] underline hover:no-underline">
            随时联系我们
          </Link>
          。
        </div>
      </main>
    </div>
  );
}
