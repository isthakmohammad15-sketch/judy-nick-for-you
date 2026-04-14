import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

interface Props {
  onNext: () => void;
}

const Slide6Letter = ({ onNext }: Props) => {
  const [stage, setStage] = useState<"closed" | "untying" | "unrolling" | "open">("closed");
  const ribbonRef = useRef<HTMLDivElement>(null);
  const scrollTopRef = useRef<HTMLDivElement>(null);
  const parchmentRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTap = () => {
    if (stage !== "closed") return;
    setStage("untying");

    // Ribbon unties and falls away
    if (ribbonRef.current) {
      const tl = gsap.timeline({
        onComplete: () => setStage("unrolling"),
      });
      tl.to(ribbonRef.current, {
        scaleY: 1.2,
        rotation: 12,
        duration: 0.4,
        ease: "power2.in",
      })
        .to(ribbonRef.current, {
          y: 80,
          opacity: 0,
          rotation: 30,
          scaleX: 0.5,
          duration: 0.8,
          ease: "power3.in",
        });
    }
  };

  useEffect(() => {
    if (stage === "unrolling") {
      const tl = gsap.timeline({ onComplete: () => setStage("open") });

      // Top dowel moves up
      if (scrollTopRef.current) {
        tl.to(scrollTopRef.current, {
          y: -10,
          duration: 0.6,
          ease: "power2.out",
        }, 0);
      }

      // Parchment unrolls downward
      if (parchmentRef.current) {
        tl.fromTo(
          parchmentRef.current,
          { maxHeight: 0, opacity: 0.5 },
          { maxHeight: 650, opacity: 1, duration: 2, ease: "power2.out" },
          0.3
        );
      }

      // Content fades in
      if (contentRef.current) {
        tl.fromTo(
          contentRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" },
          1.2
        );
      }
    }
  }, [stage]);

  // Audio management

  const handleFinishJourney = () => {
    onNext();
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 max-w-full mx-auto text-center relative">
      {/* Full scroll assembly */}
      <div className="relative w-full max-w-7xl mx-auto">

        {/* === TOP DOWEL (wooden rod) === */}
        <div ref={scrollTopRef} className="relative z-20 flex justify-center">
          <div className="relative">
            {/* Main rod */}
            <div
              className="rounded-full mx-auto"
              style={{
                width: "900px",
                height: "34px",
                background: "linear-gradient(180deg, hsl(28 35% 55%), hsl(25 40% 38%), hsl(28 35% 55%))",
                boxShadow: "0 6px 16px rgba(0,0,0,0.3), inset 0 2px 3px rgba(255,255,255,0.2)",
              }}
            />
            {/* Left knob */}
            <div
              className="absolute -left-3 top-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: "28px",
                height: "28px",
                background: "radial-gradient(circle at 35% 35%, hsl(25 30% 50%), hsl(20 35% 30%))",
                boxShadow: "2px 2px 6px rgba(0,0,0,0.3)",
              }}
            />
            {/* Right knob */}
            <div
              className="absolute -right-3 top-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: "28px",
                height: "28px",
                background: "radial-gradient(circle at 35% 35%, hsl(25 30% 50%), hsl(20 35% 30%))",
                boxShadow: "2px 2px 6px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </div>

        {/* === ROLLED SCROLL (closed state) === */}
        {(stage === "closed" || stage === "untying") && (
          <div className="relative z-10 flex justify-center -mt-2 cursor-pointer" onClick={handleTap}>
            <div className="relative" style={{ width: "900px", height: "100px" }}>
              <div
                className="absolute inset-x-0 top-0 h-24 rounded-t-full"
                style={{
                  background: "linear-gradient(180deg, hsl(41 45% 88%), hsl(38 40% 76%))",
                  boxShadow: "inset 0 10px 16px rgba(255,255,255,0.25), inset 0 -8px 24px rgba(0,0,0,0.08)",
                }}
              />
              <div
                className="absolute inset-x-0 bottom-0 h-24 rounded-b-full"
                style={{
                  background: "linear-gradient(180deg, hsl(38 40% 76%), hsl(35 35% 65%))",
                  boxShadow: "inset 0 -10px 16px rgba(0,0,0,0.12), inset 0 8px 18px rgba(255,255,255,0.2)",
                }}
              />
              <div
                className="absolute inset-x-5 top-5 bottom-5 rounded-full"
                style={{
                  background: "linear-gradient(180deg, hsl(42 34% 90%), hsl(38 28% 76%))",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.22), inset 0 3px 12px rgba(255,255,255,0.35)",
                  border: "1px solid rgba(96, 69, 41, 0.18)",
                }}
              />
              <div
                className="absolute left-1 top-1/2 -translate-y-1/2 w-10 h-12 rounded-full"
                style={{
                  background: "linear-gradient(180deg, hsl(38 40% 78%), hsl(35 35% 65%))",
                  boxShadow: "inset 2px 0 8px rgba(0,0,0,0.1)",
                }}
              />
              <div
                className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-12 rounded-full"
                style={{
                  background: "linear-gradient(180deg, hsl(38 40% 78%), hsl(35 35% 65%))",
                  boxShadow: "inset -2px 0 8px rgba(0,0,0,0.1)",
                }}
              />
              <div
                className="absolute inset-x-8 top-11 bottom-11 rounded-full opacity-40 pointer-events-none"
                style={{
                  backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
                }}
              />
            </div>

            {/* === RIBBON === */}
            <div
              ref={ribbonRef}
              className="absolute z-30 flex flex-col items-center pointer-events-none"
              style={{ top: "20px" }}
            >
              <div
                style={{
                  width: "100px",
                  height: "25px",
                  background: "linear-gradient(180deg, hsl(140 34% 37%), hsl(145 24% 30%))",
                  borderRadius: "999px",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
                }}
              />
              <div className="flex -mt-1 gap-0">
                <div
                  style={{
                    width: "40px",
                    height: "20px",
                    background: "hsl(140 30% 34%)",
                    borderRadius: "50% 50% 45% 55% / 60% 60% 40% 40%",
                    transform: "rotate(-18deg)",
                    marginRight: "-3px",
                  }}
                />
                <div
                  style={{
                    width: "40px",
                    height: "20px",
                    background: "hsl(140 30% 34%)",
                    borderRadius: "50% 50% 55% 45% / 60% 60% 40% 40%",
                    transform: "rotate(18deg)",
                    marginLeft: "-3px",
                  }}
                />
              </div>
              <div className="flex gap-1 -mt-1">
                <div
                  style={{
                    width: "7px",
                    height: "40px",
                    background: "linear-gradient(180deg, hsl(140 22% 30%), hsl(145 18% 26%))",
                    borderRadius: "0 0 2px 2px",
                    transform: "rotate(-6deg)",
                  }}
                />
                <div
                  style={{
                    width: "7px",
                    height: "38px",
                    background: "linear-gradient(180deg, hsl(140 22% 30%), hsl(145 18% 26%))",
                    borderRadius: "0 0 2px 2px",
                    transform: "rotate(6deg)",
                  }}
                />
              </div>
            </div>

            {/* Tap hint */}
            {stage === "closed" && (
              <p className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-primary-foreground/70 text-xs font-dancing animate-pulse whitespace-nowrap">
                ✦ Tap on green ribbon to untie the ribbon ✦
              </p>
            )}
          </div>
        )}

        {/* === UNROLLED PARCHMENT === */}
        {(stage === "unrolling" || stage === "open") && (
          <div
            ref={parchmentRef}
            className="relative z-10 -mt-2 overflow-hidden"
            style={{ maxHeight: 0 }}
          >
            <div
              className="relative mx-auto overflow-hidden"
              style={{
                width: "900px",
                height: "650px",
                background: "linear-gradient(180deg, hsl(40 48% 85%), hsl(38 40% 80%), hsl(36 42% 78%))",
                boxShadow: "0 15px 40px rgba(0,0,0,0.12), inset 0 0 40px rgba(255,255,255,0.18)",
                borderRadius: "1.5rem",
              }}
            >
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  backgroundImage: "url('https://www.transparenttextures.com/patterns/old-map.png')",
                }}
              />

              <div
                className="absolute inset-x-6 top-0 h-10 rounded-b-[60%]"
                style={{
                  background: "linear-gradient(180deg, rgba(239,218,164,0.98), rgba(226,198,145,0.95))",
                  boxShadow: "inset 0 8px 16px rgba(0,0,0,0.08)",
                }}
              />
              <div
                className="absolute inset-x-6 bottom-0 h-10 rounded-t-[60%]"
                style={{
                  background: "linear-gradient(180deg, rgba(226,198,145,0.95), rgba(239,218,164,0.98))",
                  boxShadow: "inset 0 -8px 16px rgba(0,0,0,0.08)",
                }}
              />

              <div
                className="absolute inset-4 pointer-events-none"
                style={{
                  border: "1.5px solid rgba(168, 130, 56, 0.28)",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
                }}
              />

              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: "inset 10px 0 25px rgba(132, 83, 34, 0.14), inset -10px 0 25px rgba(132, 83, 34, 0.14), inset 0 0 32px rgba(128, 87, 42, 0.09)",
                }}
              />

              <div className="absolute top-5 left-5 text-sm opacity-40" style={{ color: "hsl(var(--gold))" }}>❧</div>
              <div className="absolute top-5 right-5 text-sm opacity-40 -scale-x-100" style={{ color: "hsl(var(--gold))" }}>❧</div>
              <div className="absolute bottom-5 left-5 text-sm opacity-40 -scale-y-100" style={{ color: "hsl(var(--gold))" }}>❧</div>
              <div className="absolute bottom-5 right-5 text-sm opacity-40 -scale-x-100 -scale-y-100" style={{ color: "hsl(var(--gold))" }}>❧</div>

              {/* Letter content */}
              <div
                ref={contentRef}
                className="relative z-10 p-8 pt-8 text-left opacity-0 overflow-y-auto"
                style={{ maxHeight: "580px" }}
              >
                {/* Header ornament */}
                <div className="text-center mb-4">
                  <div className="text-xl" style={{ color: "hsl(var(--gold))" }}>⚜</div>
                  <div className="w-16 h-[1px] mx-auto mt-1" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.5), transparent)" }} />
                </div>

                <h3
                  className="font-dancing text-3xl md:text-4xl mb-4 text-center"
                  style={{ color: "hsl(25 50% 25%)" }}
                >
                  To my first and last bestesttttt friend (tiru..)…
                </h3>

                <div className="space-y-3 font-light text-sm md:text-base" style={{ color: "hsl(25 30% 30%)", lineHeight: "1.9" }}>
                  <p>I don't know what I am going to say in this, but what I am saying now is the real me and the truth which i hide these many days with u....</p>

                  <p>My dear best friend… my only friend…I still remember the day I made you as my bestie "its sept 15 2024 in ews lab we met eachother for doing an experiment after that u gave me ur observation to write ... on sept 18 we became eachothers closest friends in EG drawing hall..we use to call eachother as waste fellow .. and exactly on sept 22 u told iam ur bestie.. and that day was my best day ever. I cried in happy tears. I can't even express my happiness in words. Till then, I didn't have any loyal friend who talked with me that much and asked about my feelings, my sadness… and you are the first friend to share your sadness and also happiness with me. Till that day, I felt like I was nothing to anyone, and no one cared about me. Till that day, I used to hate friendship. The reason is… I also had a boy best friend who used to talk with me, and till then I used to like friendships more. I felt so much happy. After that, a third person came in 4th class. We became three friends. For some time, we were together, but then those two became best friends and left me alone. And… I don't know what happened between us… they kept me as a side part. They looked at me like an option. But it didn't make me feel bad at that time. But one day, they both stopped talking to me completely, and they both started bullying me. But I took it lightly, because they were my best friends. Slowly, the entire class started teasing me. And like that, years passed. They both became best friends, and I became just a normal classmate to them. I didn't ask them why or anything, but I started feeling lonely from the day they both stopped talking to me.</p>

                  <p>In 9th class, I was bullied a lot, especially when my hand was fractured. I don't know why, but the whole class made fun of me at that time. I was just thinking… maybe I shouldn't make any friends. Then I stopped talking with the whole class. After that, I decided not to make any trio or duo friendships. I felt that friendship is worse than a relationship. From that day, I had no friends and didn't show any interest in friendship or relationships. Because when my two best friends stopped talking to me, a girl used to talk with me in 6th class. In the whole class, only she talked to me. After that, she proposed to me, and I accepted .and ya bro i too use to have a girlfriend which means a world to me but Till 7th class, everything was good with her. But in 7th class, she left me. not because she hate my behaviour.. In that also, a third person was involved. That person didn't have any interest in love, but my two best friends forced him and made him into that mindset. After that, that person proposed to her, and she accepted. There are many more reasons, but still, I never saw them as my enemies. Because before, they were my best friends.and then I moved on silently and started being alone… only me, no one else. From that day till now, they used to wish me on my birthday, but not in stories or mentions. Sometimes they send messages, sometimes they call. But when they celebrate each other's birthdays, they post stories and meet without telling me. But it's okay for me… at least they are happy...these is the reason i dont like adding a third person in our friendship and that's y i done fights with u for talking with other person more closely ....iam sorry yaar..... may be these all r not my big problem when i compaire it with ur problems ..infront of ur problem my problem r very small....and i am easely replaced when a third person adds,idk how but i was replaced easely and that too evry time and idk y it happen only with me..always ppl choose others over me ..idk y..but its okay for me i was been habbituated for all these things...but still it will hurt after that slowly slowly again may bei will be get habituated acording to the sistuation or may not be and some times i feel low and bad when ever those things come in my mind..when ever it comes in my mind i will become silent..... and that's wht i can do..</p>

                  <p>In 10th class, I prayed to get just one loyal best friend. No trio, no more… only two. Then in B.Tech, you came and changed everything. You proved that not every friendship is the same like the past. Some are more beautiful. And I saw myself in you. That is the reason I made you as my bestie. After that, you became closer and our bond became stronger forever. I am really very grateful to you, your behaviour, your kindness, and all your efforts towards me. I am really, really thankful to you. But now… i dont know wht exactly  happened between us... u also started behaving with me like a normal classmate ..no talks like before..not even close like before..no calls no messages..and u talk with me only when i talk with u..but u also started keeping me distance....I don’t have any person not even a single person whome i can call he or she is mine except u … You’re not just a friend to me—you’re someone I trust, you’re the only hope I have when it comes to friendship.... I tried not to make our friendship like the way my past friendships were. Because of that fear and overthinking, I always created fights, so that it won't become like my past friendship. I am sorry for that. I tried my best not to make my friendship like before. I am sorry for making those useless fights. After that, I realized everything when you said that my fights and my words were making you feel low and bad, pushing you down and making you feel regret. I am sorry for that. I am really, really sorry. Somehow, I also made many mistakes. And may be because of those things only , now our friendship and bond is like this. But still, I call only you as my best friend. Because the way you treated me… no one treated me like that, not even my past best friends. That is the only reason I made you as my bestie.</p>

                  <p>I know that our bond won't be like the way we used to be before. But it's okay. I am not going to make any excuses for what I did. The truth is… I hurt you. And that's on me .I keep thinking about it and wishing I could go back and do things differently. You don't deserve pain. I know saying sorry won't erase it, but I still need to say it .All I can do now is learn from it and try to become someone who never repeats the same mistake again. But I can do all this only when you are with me .And I don't want anyone like you, except you. No one else like you. No one in your place. I want only you as my best friend, my forever bestie, and no third friends .I can sit for hours waiting for your reply. I can give you all the time you need if you're upset with me. Just tell me what went wrong instead of going silent, because your silence hurts more than your anger. And I only want us to understand each other.</p>

                  <p>I once thought I could handle everything… every pain, every broken thing. But i lost in trying to keep our bond like before. Sorry, my dear bestie…i tried my best to keep our bond and friendship like before , but maybe sometimes I wasn't the friend you deserved. I know I made mistakes, and maybe I hurt you without even realizing it. But believe me… every laugh, every memory we shared, means the world to me .No matter what happens, you will always be my favorite person.... And one thing is always coming in my mind from my 5th class …That I cannot keep anyone happy. Even if I don't want to, I will end up hurting the one who is with me. That's why no one can stay with me. That's why… I am better off alone....these thought is making me more down and down  and ya i can say that My strength is being a good friend to the only person i want in my life more and My weakness is forgetting that not everyone values friendship the same way I do. and i understood one more thing that when people lose interest, they don’t say it directly. They show it slowly… until we feel it ourselves. And when we ask what happened means, they just say ntg..”,but its okay..my past frnds said me one word which i try to forgot that but i couldn't forgot it till now i remember those words they said me that if they rome with me they will look cheap and weak itseems... may be they r correct that y no stay with me for too long because of my behaviour ,my week mindset and all...but still its okay ...</p>
                  

                  <p>Sometimes I get emotional about us. I don't always say it out loud. But you are one of the most special parts of my life. You came without promises and stayed without conditions and became my comfort zone without trying. We are not talking like before. We are not meeting like before. We are not being like the bond we used to be before. But it's okay ..but still i wish that one day our bond should be like the before or more beautiful then before if these happen then again i will be the happiest boy ever..hoping for these day to come soon and fast as possible.. I wish it should happen and i am sory for every thing and for each and everything for every single mistake i did and for every fight i did with u iam realy realy sorry .......and these is the main point iam going to say now a very important line … ("I promise—Whenever you need me, just a small text like "hello" or "hi", or the way you like to call me… just a single call… within a fraction of seconds, I will be in front of you. No matter how many fights we have, I will leave my entire ego permanently and come to you. This is the promise I can make. I won't leave you… because I made you a promise .A promise that I would never leave you and be your best friend forever. That promise I will never break. Never.")</p>
                

                  <p>u told me to stop calling u amma ...i felt very bad at that time because i thought that i made u uncomfortable but one last time i wanna use only one last time not to make u feel uncomfortable but u say thankyou ..after these i wont use amma again ...Thank you amma...Thankyou for everthing amma...Thankyou for caring. Thank you for letting me talk .Thank you for understanding me. Thank you for being there for me. Thank you for listening. Thank you for being such a good person. Thank you for everything. Just do whatever you think is right. Rise better in your life. I want to see you happy and successfull in your life and no matter with whome u r always be happy and all your wishes come true and i prayed god that ur problem should be gone permenently till these month ends.. so ur problems will be gone soon . Stay strong. If you need anything, just message me. I will be there for you. Even if I am busy… I will be free for you .Feel free to share anything with me. That's it, yaar …Stay happy. Stay blessed. Stay strong. Don't be sad for every small thing. You should not be like other girls who feel bad for small things. You should be different. I am always there to support you. Don't take any wrong decisions in your life. Stay happy with the people you are with these days. Stay cool, stay happy, enjoy, and learn from the past mistakes and try not to be like that or not to repeat those mistake again. Try not to repeat it .You are such a strong girl i ever saw in my life . Keep this in your mind… you are stronger than you think. I hope you always do well in ur life. Keep smiling… your smile is very beautiful. I like your smile, so keep smiling. Once again… happiest birthday to my one and only special friend(tiruuu..💜).</p>

                  <p className="font-dancing text-2xl md:text-3xl text-center mt-4" style={{ color: "hsl(25 50% 25%)" }}>
                    — Your friend, Isthak ended here and signed off from everything
                  </p>
                  <p className="text-center italic text-sm" style={{ color: "hsl(25 30% 30%)" }}>
                    (i hope u read the entire letter and understand who iam and which kind of person iam and my thoughts,my overthing and all and the truth which i hide from the day i meet u and so many thing like these happen with me..when we again enter into old bond then i will say ..... that's all about me yaar and once again happy birthday my only bestie)
                  </p>
                </div>

                {/* Footer ornament */}
                <div className="text-center mt-4">
                  <div className="w-16 h-[1px] mx-auto mb-1" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.5), transparent)" }} />
                  <div className="text-sm" style={{ color: "hsl(var(--gold))" }}>❦</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === BOTTOM DOWEL === */}
        <div className="relative z-20 flex justify-center -mt-1">
          <div className="relative">
            <div
              className="rounded-full mx-auto"
              style={{
                width: "900px",
                height: "34px",
                background: "linear-gradient(180deg, hsl(28 35% 55%), hsl(25 40% 38%), hsl(28 35% 55%))",
                boxShadow: "0 6px 16px rgba(0,0,0,0.3), inset 0 2px 3px rgba(255,255,255,0.2)",
              }}
            />
            <div
              className="absolute -left-3 top-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: "28px",
                height: "28px",
                background: "radial-gradient(circle at 35% 35%, hsl(25 30% 50%), hsl(20 35% 30%))",
                boxShadow: "2px 2px 6px rgba(0,0,0,0.3)",
              }}
            />
            <div
              className="absolute -right-3 top-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: "28px",
                height: "28px",
                background: "radial-gradient(circle at 35% 35%, hsl(25 30% 50%), hsl(20 35% 30%))",
                boxShadow: "2px 2px 6px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Next button */}
      {stage === "open" && (
        <button
          onClick={handleFinishJourney}
          className="mt-8 px-8 py-3 rounded-full bg-accent text-accent-foreground font-medium text-lg transition-all duration-500 hover:scale-105 animate-fade-in"
        >
          Finish Journey →
        </button>
      )}

      {/* Interactive Hint */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm border border-white/20 cursor-pointer hover:bg-black/90 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">💡</span>
            <span>Tap the green ribbon to open the letter</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide6Letter;
