'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Briefcase, ArrowUpRight, Save, Palette, Layers, Plus, Trash2, Video, Image as ImageIcon, Type } from 'lucide-react'

export default function AdminPage() {
  const supabase = createClient()
  const [company, setCompany] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newJob, setNewJob] = useState({ title: '', location: '', type: 'Full-time', description: '' })

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: companyData } = await supabase.from('companies').select('*').eq('id', user.id).single()
        setCompany(companyData)
        const { data: jobsData } = await supabase.from('jobs').select('*').eq('company_id', user.id).order('created_at', { ascending: false })
        setJobs(jobsData || [])
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('companies')
      .update({
        theme_color: company.theme_color,
        sections: company.sections,
        content: company.content,
        banner_url: company.banner_url,
        logo_url: company.logo_url,
        video_url: company.video_url,
        name: company.name
      })
      .eq('id', company.id)
    
    setSaving(false)
    if (error) alert('Error saving settings')
    else alert('Live Preview updated successfully!')
  }

  const handleAddJob = async () => {
    if (!newJob.title || !newJob.location) return alert('Please fill in job details')
    
    const { data, error } = await supabase
        .from('jobs')
        .insert({
            company_id: company.id,
            title: newJob.title,
            location: newJob.location,
            type: newJob.type,
            description: newJob.description,
            is_open: true
        })
        .select()

    if (error) {
        alert(error.message)
    } else {
        setJobs([data[0], ...jobs])
        setNewJob({ title: '', location: '', type: 'Full-time', description: '' }) 
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm('Delete this job?')) return
    const { error } = await supabase.from('jobs').delete().eq('id', jobId)
    if (!error) setJobs(jobs.filter(j => j.id !== jobId))
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 animate-pulse">Loading builder...</div>
    </div>
  )
  if (!company) return <div className="p-8 text-white">No company profile found.</div>

  // --- STYLES FOR DARK MODE INPUTS ---
  const inputClass = "bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-500";
  const labelClass = "text-slate-300 font-medium text-sm flex items-center gap-2";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20 relative overflow-x-hidden">
      
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]" />
      </div>

      {/* --- Sticky Header --- */}
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 mb-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
                    <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black tracking-tight text-white">CAREERFY</span>
            </div>

            <div className="flex gap-3">
                <Button variant="outline" size="sm" asChild className="hidden md:flex border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white">
                    <a href={`/${company.slug}`} target="_blank" className="flex items-center gap-2">
                        Live Page <ArrowUpRight className="w-4 h-4" />
                    </a>
                </Button>
                <Button onClick={handleSave} disabled={saving} size="sm" className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Column: Branding */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-slate-900/50 border-slate-800 shadow-xl backdrop-blur-sm">
            <CardHeader className="border-b border-slate-800/50 pb-4">
                <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Palette className="w-5 h-5 text-blue-500" /> Branding
                </CardTitle>
                <CardDescription className="text-slate-400">Set your Comapny's Theme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <div className="space-y-2">
                <Label className={labelClass}><Type className="w-4 h-4" /> Company Name</Label>
                <Input className={inputClass} value={company.name} onChange={(e) => setCompany({...company, name: e.target.value})} />
              </div>
              
              <div className="space-y-2">
                <Label className={labelClass}><div className="w-4 h-4 rounded-full border border-slate-500" style={{background: company.theme_color}}/> Theme Color</Label>
                <div className="flex items-center gap-2 p-1 bg-slate-950 border border-slate-700 rounded-md">
                    <input 
                        type="color" 
                        value={company.theme_color} 
                        onChange={(e) => setCompany({...company, theme_color: e.target.value})}
                        className="h-8 w-full bg-transparent border-none cursor-pointer"
                    />
                </div>
              </div>

              <div className="space-y-2">
                <Label className={labelClass}><ImageIcon className="w-4 h-4" /> Logo URL</Label>
                <Input className={inputClass} value={company.logo_url} onChange={(e) => setCompany({...company, logo_url: e.target.value})} />
              </div>
              
              <div className="space-y-2">
                <Label className={labelClass}><ImageIcon className="w-4 h-4" /> Banner URL</Label>
                <Input className={inputClass} value={company.banner_url} onChange={(e) => setCompany({...company, banner_url: e.target.value})} />
              </div>
              
              <div className="space-y-2">
                <Label className={labelClass}><Video className="w-4 h-4" /> Video URL</Label>
                <Input className={inputClass} placeholder="YouTube Link" value={company.video_url || ''} onChange={(e) => setCompany({...company, video_url: e.target.value})} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Sections & Jobs */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* CONTENT SECTIONS CARD */}
          <Card className="bg-slate-900/50 border-slate-800 shadow-xl backdrop-blur-sm">
            <CardHeader className="border-b border-slate-800/50 pb-4">
                <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-500" /> CONTENT
                </CardTitle>
                <CardDescription className="text-slate-400">Customize the Contents of your preview page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {['about', 'life', 'team', 'offices'].map((key) => (
                <div key={key} className="border border-slate-800 rounded-lg p-4 space-y-4 bg-slate-950/30 hover:bg-slate-900/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold capitalize text-base text-slate-200">{key} Section</h3>
                    <Switch 
                        checked={company.sections[key]}
                        onCheckedChange={(checked) => setCompany({...company, sections: {...company.sections, [key]: checked}})}
                        className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-700"
                    />
                  </div>
                  {company.sections[key] && (
                      <div className="animate-in fade-in slide-in-from-top-1">
                        <Textarea 
                            rows={3}
                            value={company.content?.[key] || ''}
                            onChange={(e) => setCompany({...company, content: { ...company.content, [key]: e.target.value }})}
                            placeholder={`Tell candidates about your ${key}...`}
                            className={inputClass}
                        />
                      </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* JOB MANAGEMENT CARD */}
          <Card className="bg-slate-900/50 border-slate-800 shadow-xl backdrop-blur-sm">
            <CardHeader className="border-b border-slate-800/50 pb-4">
                <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-green-500" /> Job Management
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                
                {/* Add New Job Form */}
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-lg space-y-4 shadow-inner">
                    <h3 className="font-semibold text-sm uppercase text-slate-500 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add New Role
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Input className={inputClass} placeholder="Job Title" value={newJob.title} onChange={(e) => setNewJob({...newJob, title: e.target.value})} />
                        <Input className={inputClass} placeholder="Location" value={newJob.location} onChange={(e) => setNewJob({...newJob, location: e.target.value})} />
                    </div>
                    <Textarea className={inputClass} placeholder="Paste full job description here..." value={newJob.description} onChange={(e) => setNewJob({...newJob, description: e.target.value})} />
                    <div className="flex gap-4">
                        <select 
                            className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={newJob.type}
                            onChange={(e) => setNewJob({...newJob, type: e.target.value})}
                        >
                            <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
                        </select>
                        <Button onClick={handleAddJob} className="bg-white text-slate-900 hover:bg-slate-200 font-semibold">
                            Add Job
                        </Button>
                    </div>
                </div>

                {/* Job List */}
                <div className="space-y-3">
                    {jobs.length === 0 && <p className="text-slate-500 text-center italic">No jobs added yet.</p>}
                    {jobs.map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-4 border border-slate-800 rounded-lg bg-slate-900/50 hover:border-slate-600 transition-colors">
                            <div>
                                <div className="font-medium text-slate-200">{job.title}</div>
                                <div className="text-xs text-slate-500">{job.location} • {job.type}</div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-950/50" onClick={() => handleDeleteJob(job.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}