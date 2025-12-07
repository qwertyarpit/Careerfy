'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function JobBoard({ jobs, themeColor }: { jobs: any[], themeColor: string }) {
  const [search, setSearch] = useState('')
  const [locationFilter, setLocationFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  
  // New State: Track which job is expanded
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null)

  const locations = ['All', ...Array.from(new Set(jobs.map(j => j.location)))]
  const types = ['All', ...Array.from(new Set(jobs.map(j => j.type)))]

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase())
      const matchesLocation = locationFilter === 'All' || job.location === locationFilter
      const matchesType = typeFilter === 'All' || job.type === typeFilter
      return matchesSearch && matchesLocation && matchesType
    })
  }, [jobs, search, locationFilter, typeFilter])

  return (
    <div id="jobs" className="pt-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Open Roles</h2>

      {/* Filters */}
      <div className="bg-gray-50 p-6 rounded-xl mb-8 space-y-4 md:space-y-0 md:flex gap-4 items-center border">
        <div className="flex-1">
            <Input 
                placeholder="Search job titles..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white"
            />
        </div>
        <select 
            className="h-10 px-3 rounded-md border border-input bg-white text-sm"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
        >
            {locations.map(loc => <option key={loc} value={loc}>{loc === 'All' ? 'All Locations' : loc}</option>)}
        </select>
        <select 
            className="h-10 px-3 rounded-md border border-input bg-white text-sm"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
        >
            {types.map(t => <option key={t} value={t}>{t === 'All' ? 'All Job Types' : t}</option>)}
        </select>
      </div>

      {/* Job List */}
      <div className="grid gap-4">
        {filteredJobs.length > 0 ? filteredJobs.map((job) => (
            // Makng the card clickable to toggle expansion
            <div 
                key={job.id} 
                onClick={() => setExpandedJobId(expandedJobId === job.id ? null : job.id)}
                className={`group border rounded-xl bg-white transition-all cursor-pointer overflow-hidden
                    ${expandedJobId === job.id ? 'ring-2 ring-offset-2' : 'hover:border-[var(--brand)] hover:shadow-md'}
                `}
                style={{ '--brand': themeColor, '--ring': themeColor } as any}
            >
                {/* Job Header Always Visible */}
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-xl font-semibold group-hover:text-[var(--brand)] transition-colors">{job.title}</h3>
                        <div className="flex items-center gap-3 text-gray-500 mt-2 text-sm">
                            <span>📍 {job.location}</span>
                            <span>💼 {job.type}</span>
                        </div>
                    </div>
                    <Button 
                        className="text-white transition-opacity"
                        style={{ backgroundColor: themeColor }}
                    >
                        {expandedJobId === job.id ? 'Close Details' : 'View Details'}
                    </Button>
                </div>

                {/* Job Description Visible only when expanded */}
                {expandedJobId === job.id && (
                    <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 duration-200">
                        <div className="h-px bg-gray-100 mb-4" /> {/* Separator Line */}
                        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                            {job.description || "No description provided."}
                        </div>
                        <div className="mt-6">
                            <Button className="w-full md:w-auto" size="lg" style={{ backgroundColor: themeColor }}>
                                Apply Now
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        )) : (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                No jobs found matching your filters.
            </div>
        )}
      </div>
    </div>
  )
}