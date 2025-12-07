import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import JobBoard from '../../components/JobBoard' 

export const dynamic = 'force-dynamic'

function getEmbedUrl(url: string | null) {
  if (!url) return null;
  if (url.includes('youtu.be')) {
    const id = url.split('/').pop()?.split('?')[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes('youtube.com') && url.includes('v=')) {
    const id = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  return url;
}

export default async function CareerPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const supabase = await createClient()
  
  const { data: company } = await supabase.from('companies').select('*').eq('slug', params.slug).single()
  if (!company) return notFound()

  const { data: jobs } = await supabase.from('jobs').select('*').eq('company_id', company.id).eq('is_open', true)

  const finalVideoUrl = getEmbedUrl(company.video_url);
  const isYouTube = finalVideoUrl?.includes('youtube.com/embed');
  
  return (
    <div 
      className="min-h-screen pb-20 font-sans" 
      // --- NEW: CSS Color Mix for Dynamic Background ---
      style={{ 
        '--brand': company.theme_color,
        // Mix 8% of brand color with White. Creates a perfect light tint.
        backgroundColor: 'color-mix(in srgb, var(--brand) 8%, white)' 
      } as any}
    >
      
      {/* Banner */}
      <div className="relative h-[350px] w-full bg-slate-900 overflow-hidden">
        {company.banner_url && (
            <img src={company.banner_url} alt="Banner" className="w-full h-full object-cover opacity-60" />
        )}
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pt-10">
            {company.logo_url && (
                 <img src={company.logo_url} alt="Logo" className="w-24 h-24 rounded-2xl shadow-2xl mb-6 bg-white object-contain p-2" />
            )}
            <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg tracking-tight">{company.name}</h1>
            {/* <p className="text-white/90 mt-4 text-xl font-medium max-w-2xl">Join us and do the best work of your life.</p> */}
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-6 -mt-10 relative z-10 space-y-12">

        {/* Video Section */}
        {finalVideoUrl && (
            <section className="rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video border-4 border-white">
                {isYouTube ? (
                    <iframe src={finalVideoUrl} className="w-full h-full border-0" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
                ) : (
                    <video src={finalVideoUrl} controls className="w-full h-full" playsInline />
                )}
            </section>
        )}
        
        {/* Sections */}
        {['about', 'life', 'team', 'offices'].map(section => company.sections[section] && (
            <section key={section} className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-white/50">
                <h2 className="text-2xl font-bold mb-4 capitalize flex items-center gap-2" style={{ color: 'var(--brand)' }}>
                   {section}
                </h2>
                <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">{company.content?.[section]}</p>
            </section>
        ))}

        {/* Job Board */}
        <div className="bg-white/60 backdrop-blur-md p-2 rounded-3xl">
           <JobBoard jobs={jobs || []} themeColor={company.theme_color} />
        </div>

      </div>
    </div>
  )
}