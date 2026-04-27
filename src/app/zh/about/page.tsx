import NavBar from "../../components/navbar";

export default function ChineseAboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-3xl font-semibold text-zinc-900 font-beckman">
            关于我们
          </h1>
          <section lang="zh-CN">
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">
              欢迎美食好奇者回家
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-zinc-700">
              <p>
                你是否曾盯着一颗长相奇特的南瓜，心里犯嘀咕……我到底该怎么“处理”你？你是否曾在农产品区纠结过“本地 vs. 有机”的选择？没错，你就是我们要找的同道中人。
              </p>
              <p>
                Grocery-Share [杂货真闻共享] 是你数字化的美食智友。我们在这里为你破解令人困惑的食品标签密码，分享日常食材背后的趣闻轶事，并提供真正实用的厨房妙招。
              </p>
              <p>
                可以把我们看作一半是百科全书，一半是喜剧秀，同时 100% 是你健康饮食的啦啦队长。学习食物知识应该和享用美食一样快乐。让我们一起，变得美味又博学吧。
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
