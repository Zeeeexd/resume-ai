import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { resumeAPI, analysisAPI } from '../services/api'
import { Spinner, AnalyzingLoader } from '../components/LoadingState'

const ROLES = [
  'AI/ML Engineer', 'Software Developer', 'Data Scientist', 'Data Analyst',
  'Web Developer', 'Cybersecurity Analyst', 'Cloud Engineer',
  'DevOps Engineer', 'Backend Developer', 'Frontend Developer',
  'Product Manager', 'Business Analyst', 'Custom Role',
]

export default function Analyze() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [resumeId, setResumeId] = useState(null)
  const [previewText, setPreviewText] = useState('')
  const [role, setRole] = useState('')
  const [customRole, setCustomRole] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [step, setStep] = useState(1) // 1=upload, 2=configure, 3=analyzing
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  const onDrop = useCallback(async (accepted, rejected) => {
    if (rejected.length > 0) {
      toast.error('Only PDF and DOCX files under 10 MB are accepted.')
      return
    }
    const f = accepted[0]
    setFile(f)
    setUploading(true)
    try {
      const res = await resumeAPI.upload(f)
      setResumeId(res.data.id)
      // Show a short preview hint
      setPreviewText(`"${f.name}" uploaded successfully. Ready to analyze.`)
      setStep(2)
      toast.success('Resume uploaded!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Upload failed')
      setFile(null)
    } finally {
      setUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled: uploading,
  })

  const handleAnalyze = async () => {
    const targetRole = role === 'Custom Role' ? customRole : role
    if (!targetRole.trim()) { toast.error('Please select or enter a target role'); return }
    setAnalyzing(true)
    setStep(3)
    try {
      const res = await analysisAPI.analyze({
        resume_id: resumeId,
        target_role: targetRole,
        job_description: jobDesc || null,
      })
      toast.success('Analysis complete!')
      navigate(`/analysis/${res.data.id}`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Analysis failed. Please try again.')
      setStep(2)
    } finally {
      setAnalyzing(false)
    }
  }

  if (step === 3) return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto"><AnalyzingLoader /></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Analyze Your Resume</h1>
          <p className="text-gray-400 mt-1">Upload your resume and let AI evaluate it for your target role</p>
        </div>

        {/* Step 1: Upload */}
        <div className="card mb-5">
          <h2 className="section-title flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">1</span>
            Upload Resume
          </h2>

          {!file ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-indigo-500 bg-indigo-600/10' : 'border-gray-700 hover:border-indigo-500/50 hover:bg-gray-800/30'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-300 font-medium mb-1">{isDragActive ? 'Drop it here...' : 'Drag & drop your resume'}</p>
              <p className="text-gray-500 text-sm mb-4">or click to browse</p>
              <p className="text-xs text-gray-600">PDF or DOCX · max 10 MB</p>
              {uploading && <div className="mt-4 flex justify-center"><Spinner /></div>}
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl">
              <FileText className="w-8 h-8 text-indigo-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{file.name}</p>
                <p className="text-xs text-emerald-400">{previewText}</p>
              </div>
              <button
                onClick={() => { setFile(null); setResumeId(null); setStep(1); setPreviewText('') }}
                className="text-gray-500 hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Step 2: Configure */}
        {step >= 2 && (
          <div className="card mb-5 animate-fade-in-up">
            <h2 className="section-title flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              Target Role
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Select role</label>
              <div className="relative">
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="input appearance-none pr-10"
                >
                  <option value="">-- Choose a target role --</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {role === 'Custom Role' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Custom role name</label>
                <input
                  type="text"
                  value={customRole}
                  onChange={e => setCustomRole(e.target.value)}
                  placeholder="e.g. Blockchain Developer"
                  className="input"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Job Description <span className="text-gray-500 font-normal">(optional but recommended)</span>
              </label>
              <textarea
                value={jobDesc}
                onChange={e => setJobDesc(e.target.value)}
                rows={5}
                placeholder="Paste the job description here for a more accurate analysis..."
                className="input resize-none"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing || !role}
              className="btn-primary w-full mt-5 flex items-center justify-center gap-2"
            >
              {analyzing ? <Spinner size="sm" /> : null}
              {analyzing ? 'Analyzing...' : '✨ Analyze with AI'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
