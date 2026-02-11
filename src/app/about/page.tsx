import NavBar from "../components/navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <NavBar />
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm space-y-10">
          <h1 className="mb-6 text-3xl font-semibold text-zinc-900 font-beckman">
            ABOUT
          </h1>

          {/* English */}
          <section>
            <h2 className="text-xl font-semibold text-zinc-900 mb-4">
              Your Food Curiosity, Welcome Home.
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-zinc-700">
              <p>
                Ever stared at a strange squash and wondered... what do I even
                &ldquo;do&rdquo; with you? Have you debated the &ldquo;local vs.
                organic&rdquo; question in the produce section? You&apos;re our
                people.
              </p>
              <p>
                GroceryShare is your digital food-savvy friend. We&apos;re here
                to crack the code on confusing labels, share the quirky tales
                behind everyday ingredients.
              </p>
              <p>
                Think of us as part encyclopedia, part comedy show, and 100% your
                cheerleader in eating well. We celebrate Canada&apos;s food
                seasons, from berry-picking to root veggie comfort, and explore
                global flavours found in our multicultural aisles. Learning about
                food should be as enjoyable as eating it. Let&apos;s get
                deliciously knowledgeable together.
              </p>
            </div>
          </section>

          {/* Simplified Chinese */}
          <section className="border-t border-zinc-200 pt-8">
            <h3 className="text-lg font-semibold text-zinc-900 mb-3">
              简体中文
            </h3>
            <h4 className="text-base font-semibold text-zinc-800 mb-3">
              欢迎美食好奇者回家
            </h4>
            <div className="space-y-4 text-base leading-relaxed text-zinc-700">
              <p>
                你是否曾盯着一颗长相奇特的南瓜，心里犯嘀咕……我到底该怎么&quot;处理&quot;你？你是否曾在农产品区纠结过&quot;本地 vs.
                有机&quot;的选择？没错，你就是我们要找的同道中人。
              </p>
              <p>
                GroceryShare [杂货真闻共享] 是你数字化的美食智友。我们在这里为你破解令人困惑的食品标签密码，分享日常食材背后的趣闻轶事（你知道吗？加拿大有一条&quot;芥菜籽带&quot;！），并提供真正实用的厨房妙招。
              </p>
              <p>
                可以把我们看作一半是百科全书，一半是喜剧秀，同时100%是你健康饮食的啦啦队长。我们庆祝加拿大的饮食季节，从采摘浆果到享用根茎蔬菜的暖心时刻，并探索我们多元文化货架上发现的全球风味。学习食物知识应该和享用美食一样快乐。让我们一起，变得美味又博学吧。
              </p>
            </div>
          </section>

          {/* Traditional Chinese */}
          <section className="border-t border-zinc-200 pt-8">
            <h3 className="text-lg font-semibold text-zinc-900 mb-3">
              繁體中文
            </h3>
            <h4 className="text-base font-semibold text-zinc-800 mb-3">
              歡迎美食好奇者回家
            </h4>
            <div className="space-y-4 text-base leading-relaxed text-zinc-700">
              <p>
                你是否曾盯著一顆長相奇特的南瓜，心裡犯嘀咕……我到底該怎麼「處理」你？你是否曾在農產品區糾結過「本地 vs.
                有機」的選擇？沒錯，你就是我們要找的同道中人。
              </p>
              <p>
                GroceryShare [雜貨真聞共享] 是你數位化的美食智友。我們在這裡為你破解令人困惑的食品標籤密碼，分享日常食材背後的趣聞軼事（你知道嗎？加拿大有一條「芥菜籽帶」！），並提供真正實用的廚房妙招。
              </p>
              <p>
                可以把我們看作一半是百科全書，一半是喜劇秀，同時100%是你健康飲食的啦啦隊長。我們慶祝加拿大的飲食季節，從採摘漿果到享用根莖蔬菜的暖心時刻，並探索我們多元文化貨架上發現的全球風味。學習食物知識應該和享用美食一樣快樂。讓我們一起，變得美味又博學吧。
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
