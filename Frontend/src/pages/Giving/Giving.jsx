import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Download, Copy, Check, FileText, Search, Maximize2, X,
  ShieldCheck, Smartphone, Landmark, Sparkles
} from 'lucide-react';
import { documentsService } from '@/api/documents.service';
import jetSwal from '@/lib/swal';

export default function Giving() {
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [searchDoc, setSearchDoc] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [copiedPaybill, setCopiedPaybill] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [showPosterModal, setShowPosterModal] = useState(false);

  useEffect(() => {
    documentsService.getAll()
      .then(setDocuments)
      .catch(() => {})
      .finally(() => setLoadingDocs(false));
  }, []);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'paybill') {
      setCopiedPaybill(true);
      setTimeout(() => setCopiedPaybill(false), 2000);
    } else {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    }
  };

  const handleDownload = (doc) => {
    jetSwal.fire({
      icon: 'info',
      title: 'Downloading Document',
      text: `Preparing "${doc.title}" for download…`,
      timer: 1800,
      showConfirmButton: false,
    });
    const link = document.createElement('a');
    link.href = doc.fileUrl;
    link.target = '_blank';
    link.download = doc.fileName || `${doc.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categories = ['ALL', ...Array.from(new Set(documents.map(d => d.category)))];

  const filteredDocs = documents
    .filter(d => selectedCat === 'ALL' || d.category === selectedCat)
    .filter(d =>
      d.title.toLowerCase().includes(searchDoc.toLowerCase()) ||
      (d.description || '').toLowerCase().includes(searchDoc.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-20">

        {/* ── Section 1: Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
            <Heart className="w-3.5 h-3.5 fill-primary" /> Generosity & Resources
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Partner in Ministry & Downloads
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
            <span className="block mt-1 font-bold text-foreground">— 2 Corinthians 9:7</span>
          </p>
        </motion.div>

        {/* ── Section 2: Giving Details (Image Graphic Poster) ── */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Giving Details</h2>
              <p className="text-sm text-muted-foreground">Official JET Ministry M-Pesa Paybill & Bank transfer poster</p>
            </div>
            <button
              onClick={() => setShowPosterModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-xs font-bold hover:bg-muted transition-colors cursor-pointer"
            >
              <Maximize2 className="w-4 h-4 text-primary" />
              <span>Expand Poster</span>
            </button>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Giving Image Poster Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-7 relative group rounded-3xl overflow-hidden border border-border shadow-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-black p-6 md:p-10 cursor-pointer"
              onClick={() => setShowPosterModal(true)}
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Heart className="w-72 h-72 text-white" />
              </div>

              {/* Graphic Giving Card Design */}
              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src="/jet-logo.jpeg" alt="JET Logo" className="w-12 h-12 rounded-xl shadow-md" />
                    <div>
                      <h3 className="font-extrabold text-lg text-white">JET Ministries International</h3>
                      <p className="text-xs text-white/60">Official Giving & Tithes Channel</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#0096FF]/20 text-[#0096FF] border border-[#0096FF]/40 text-xs font-bold">
                    VERIFIED
                  </span>
                </div>

                {/* Main M-Pesa & Bank Details Box */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* M-Pesa Box */}
                  <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md space-y-3">
                    <div className="flex items-center justify-between text-emerald-400">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5" />
                        <span className="font-bold text-xs uppercase tracking-wider">M-PESA PAYBILL</span>
                      </div>
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Business No / Paybill</p>
                      <p className="text-3xl font-black text-white tracking-wider">247247</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Account Name</p>
                      <p className="text-sm font-bold text-emerald-300">0799573554</p>
                    </div>
                  </div>

                  {/* Bank Box */}
                  <div className="p-5 rounded-2xl bg-[#0096FF]/10 border border-[#0096FF]/30 backdrop-blur-md space-y-3">
                    <div className="flex items-center justify-between text-[#0096FF]">
                      <div className="flex items-center gap-2">
                        <Landmark className="w-5 h-5" />
                        <span className="font-bold text-xs uppercase tracking-wider">EQUITY BANK</span>
                      </div>
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Account Number</p>
                      <p className="text-xl font-bold text-white tracking-wider">0799573554</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Account Name</p>
                      <p className="text-sm font-bold text-sky-300">JET MINISTRIES INTL</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center text-xs text-white/50 border-t border-white/10">
                  Click poster image to view high-resolution view
                </div>
              </div>
            </motion.div>

            {/* Giving Quick Copy Cards */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl bg-card border border-border shadow-xl space-y-4">
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" /> Quick Copy Details
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Use the one-click copy buttons below to easily paste Paybill or Account details directly into your mobile banking app.
                </p>

                {/* Copy Paybill */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">M-Pesa Paybill</p>
                    <p className="text-base font-extrabold text-foreground">247247</p>
                  </div>
                  <button
                    onClick={() => handleCopy('247247', 'paybill')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all cursor-pointer"
                  >
                    {copiedPaybill ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedPaybill ? 'Copied!' : 'Copy Paybill'}</span>
                  </button>
                </div>

                {/* Copy Account */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Account Number</p>
                    <p className="text-base font-extrabold text-foreground">0799573554</p>
                  </div>
                  <button
                    onClick={() => handleCopy('0799573554', 'account')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border text-foreground font-bold text-xs hover:bg-muted transition-all cursor-pointer"
                  >
                    {copiedAccount ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedAccount ? 'Copied!' : 'Copy Account'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3: Downloadable Ministry Documents ── */}
        <section className="space-y-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" /> Ministry Documents & Downloads
              </h2>
              <p className="text-sm text-muted-foreground">
                Directly download official fellowship materials, study guides, vision manuals, and reports.
              </p>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3.5 py-2.5 w-full md:w-72">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                value={searchDoc}
                onChange={(e) => setSearchDoc(e.target.value)}
                placeholder="Search documents…"
                className="bg-transparent text-xs text-foreground placeholder-muted-foreground outline-none w-full"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCat === cat
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Documents Grid */}
          {loadingDocs ? (
            <div className="py-20 text-center text-muted-foreground text-sm">Loading documents…</div>
          ) : filteredDocs.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-border rounded-3xl p-8">
              <FileText className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-bold text-foreground">No documents found</p>
              <p className="text-xs text-muted-foreground mt-1">Uploaded ministry documents will appear here for download.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocs.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col justify-between p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all shadow-md hover:shadow-xl group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                        {doc.category}
                      </span>
                      {doc.fileSize && (
                        <span className="text-[11px] text-muted-foreground font-mono">{doc.fileSize}</span>
                      )}
                    </div>
                    <h3 className="font-bold text-foreground text-base leading-snug group-hover:text-primary transition-colors">
                      {doc.title}
                    </h3>
                    {doc.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {doc.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-5 mt-4 border-t border-border flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground/60 font-mono truncate max-w-[140px]">
                      {doc.fileName || 'Document File'}
                    </span>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Poster Image Modal */}
      <AnimatePresence>
        {showPosterModal && (
          <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowPosterModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-2xl w-full bg-slate-900 border border-border rounded-3xl p-8 shadow-2xl text-white space-y-6"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPosterModal(false)}
                className="absolute top-4 right-4 w-9 h-9 grid place-items-center rounded-xl bg-white/10 text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-center space-y-2">
                <img src="/jet-logo.jpeg" alt="JET Logo" className="w-16 h-16 rounded-2xl mx-auto shadow-lg" />
                <h3 className="text-2xl font-black text-white">JET MINISTRIES GIVING POSTER</h3>
                <p className="text-xs text-white/60">Official Giving & Donation Poster</p>
              </div>
              <div className="p-6 rounded-2xl bg-black/60 border border-white/15 space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-sm font-bold text-emerald-400">M-PESA PAYBILL</span>
                  <span className="text-2xl font-black text-white">247247</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-sm font-bold text-sky-400">EQUITY BANK ACC</span>
                  <span className="text-2xl font-black text-white">0799573554</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-amber-400">ACCOUNT NAME</span>
                  <span className="text-sm font-extrabold text-white">JET MINISTRIES INTL</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
