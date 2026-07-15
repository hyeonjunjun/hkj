import { notFound } from "next/navigation";
import { works } from "@/data/works";
import RoomHeader from "@/components/RoomHeader";
import { MediaRenderer } from "@/components/works/WorkTile";
import CornerMark from "@/components/CornerMark";

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

interface WorkPageProps {
  params: Promise<{ slug: string }>;
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const work = works.find((w) => w.slug === slug);
  if (!work) notFound();

  return (
    <main className="relative min-h-screen w-full bg-white font-sans text-black">
      <RoomHeader roomLabel="WORKS" />
      
      <article className="pt-24 md:pt-32 pb-32">
        <div className="px-6 md:px-12 max-w-[1500px] mx-auto">
          <header className="mb-12 md:mb-20">
            <h1 className="font-sans text-[clamp(3rem,8vw,8rem)] font-bold leading-[0.9] tracking-[-0.02em] uppercase">
              {work.title}
            </h1>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-16 md:mb-24">
            <div className="md:col-span-4 lg:col-span-3">
              <div className="sticky top-24 font-mono text-sm uppercase tracking-widest text-gray-500 flex flex-col gap-4">
                <div>
                  <span className="block text-gray-400 mb-1">CLIENT</span>
                  <span className="text-black">{work.title}</span>
                </div>
                <div>
                  <span className="block text-gray-400 mb-1">ROLE</span>
                  <span className="text-black">{work.role}</span>
                </div>
                <div>
                  <span className="block text-gray-400 mb-1">YEAR</span>
                  <span className="text-black">{work.year}</span>
                </div>
                <div>
                  <span className="block text-gray-400 mb-1">CATEGORY</span>
                  <span className="text-black">{work.category}</span>
                </div>
                <div>
                  <span className="block text-gray-400 mb-1">STATUS</span>
                  <span className="text-black">{work.status}</span>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-8 lg:col-span-7 lg:col-start-5">
              <p className="font-sans text-[clamp(1.2rem,2vw,2rem)] leading-[1.4] text-black">
                {work.description}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full">
           <MediaRenderer media={work.media} />
        </div>
        
        {/* Additional media sections would go here in a real case study */}
        <div className="mt-24 text-center">
          <p className="font-mono text-sm uppercase tracking-widest text-gray-400">
             End of project
          </p>
        </div>
      </article>
      <CornerMark />
    </main>
  );
}
