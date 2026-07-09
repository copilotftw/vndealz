'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Store, ChevronRight, CheckCircle2, Link as LinkIcon, Search } from 'lucide-react'

// Dummy campaigns based on merchant (in a real app this would come from the database)
const DUMMY_CAMPAIGNS: Record<string, any[]> = {
  'SumUp': [
    { id: '1', title: 'Shop: bis zu 100€ Rabatt für Geworbenen & 30€ für Werber', desc: 'Empfehlungslink · Hinzugefügt von 7 Nutzern' },
    { id: '2', title: 'Pay: 10€ Prämie für Neukunden & Werber', desc: 'Empfehlungscode · Hinzugefügt von 235 Nutzern' }
  ],
  'DKB': [
    { id: '3', title: 'DKB: 50€ Prämie für Werber und Geworbenen', desc: 'Empfehlungslink · Hinzugefügt von 174 Nutzern' }
  ]
}

export function ReferralForm() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('referralForm')
  const [isPending, startTransition] = useTransition()
  
  const [step, setStep] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMerchant, setSelectedMerchant] = useState<string | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null)
  const [link, setLink] = useState('')

  const STEPS = [
    { id: 1, nameKey: 'stepMerchant', icon: Store },
    { id: 2, nameKey: 'stepOffer', icon: CheckCircle2 },
    { id: 3, nameKey: 'stepLink', icon: LinkIcon }
  ]

  const merchants = ['SumUp', 'DKB', 'Trade Republic', 'N26', 'American Express'].filter(m => 
    m.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleMerchantSelect = (merchant: string) => {
    setSelectedMerchant(merchant)
    setStep(2)
  }

  const handleCampaignSelect = (campaign: any) => {
    setSelectedCampaign(campaign)
    setStep(3)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit the referral link to the backend
    startTransition(async () => {
      // Mock API call
      await new Promise(r => setTimeout(r, 1000))
      router.push('/')
    })
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto items-start pt-8 pb-16">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 glass-strong rounded-[var(--border-radius-xl)] p-4 sticky top-24 hidden md:block">
        <h2 className="text-xl font-bold mb-6 px-2">{t('sidebarTitle')}</h2>
        <div className="flex flex-col space-y-1">
          {STEPS.map((s) => {
            const Icon = s.icon
            const isActive = step === s.id
            const isPast = step > s.id
            
            return (
              <button
                key={s.id}
                type="button"
                disabled={step < s.id}
                onClick={() => setStep(s.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold text-sm text-left ${
                  isActive 
                    ? 'bg-black/5 dark:bg-white/5 text-[var(--color-text)]' 
                    : isPast 
                      ? 'text-[var(--color-text-muted)] hover:bg-black/5 dark:hover:bg-white/5' 
                      : 'text-[var(--color-text-muted)] opacity-50 cursor-not-allowed'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                  isActive ? 'border-[var(--color-primary)]' : isPast ? 'border-[#3ea534] text-[#3ea534]' : 'border-current opacity-50'
                }`}>
                  {isPast ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                {t(s.nameKey as any)}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 w-full max-w-3xl mx-auto">
        
        {/* Step 1: Select Merchant */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">{t('step1Title')}</h1>
            
            <div className="space-y-2 max-w-2xl mx-auto">
              <label className="text-sm font-bold text-[var(--color-text)]">{t('searchMerchant')}</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                <Input 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="pl-12 h-12 text-base rounded-lg bg-black/5 dark:bg-white/5 border-[var(--color-border)] focus:border-[#3ea534] focus:ring-[#3ea534]"
                />
              </div>
            </div>

            {searchQuery && (
              <div className="max-w-2xl mx-auto border border-[var(--color-border)] rounded-xl overflow-hidden glass">
                {merchants.length > 0 ? (
                  merchants.map(m => (
                    <button
                      key={m}
                      onClick={() => handleMerchantSelect(m)}
                      className="w-full text-left px-4 py-4 border-b border-[var(--color-border)] last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold text-xs">
                        {m.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold flex-1">{m}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-[var(--color-text-muted)]">
                    {t('noMerchantFound')}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Offer */}
        {step === 2 && selectedMerchant && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">{t('step2Title')}</h1>
            
            <div className="flex items-center gap-4 max-w-2xl mx-auto mb-8">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center font-bold text-xl text-black border shadow-sm">
                {selectedMerchant.substring(0, 2).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold">{selectedMerchant}</h2>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              {(DUMMY_CAMPAIGNS[selectedMerchant] || []).map(campaign => (
                <button
                  key={campaign.id}
                  onClick={() => handleCampaignSelect(campaign)}
                  className="w-full text-left p-4 rounded-xl border border-[var(--color-border)] bg-black/5 dark:bg-white/5 hover:border-[#3ea534] transition-colors flex items-center justify-between group"
                >
                  <div>
                    <h3 className="font-bold text-lg">{campaign.title}</h3>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">{campaign.desc}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#3ea534] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </button>
              ))}
              
              <button className="mt-4 px-4 py-2 border border-[var(--color-border)] rounded-full text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                {t('requestCampaign')}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Enter Link */}
        {step === 3 && selectedCampaign && (
          <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">{t('step3Title')}</h1>
            
            <div className="flex items-center gap-4 max-w-2xl mx-auto mb-8">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center font-bold text-xl text-black border shadow-sm">
                {selectedMerchant!.substring(0, 2).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold">{selectedMerchant}</h2>
            </div>

            <div className="max-w-2xl mx-auto p-4 rounded-xl border border-[var(--color-border)] bg-black/5 dark:bg-white/5 mb-8">
              <h3 className="font-bold text-lg">{selectedCampaign.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">{selectedCampaign.desc}</p>
              
              <div className="mt-4 space-y-2">
                <h4 className="font-bold text-sm">{t('conditionsTitle')}</h4>
                <ul className="list-disc pl-5 text-sm space-y-1 text-[var(--color-text-muted)]">
                  <li>{t('condition1')}</li>
                  <li>{t('condition2')}</li>
                  <li>{t('condition3')}</li>
                </ul>
              </div>
            </div>

            <div className="max-w-2xl mx-auto space-y-2">
              <label className="text-sm font-bold text-[var(--color-text)]">{t('linkInputLabel')}</label>
              <div className="flex gap-2">
                <Input 
                  value={link}
                  onChange={e => setLink(e.target.value)}
                  type="url"
                  required
                  placeholder="https://www.site.com/"
                  className="h-12 text-base rounded-lg bg-black/5 dark:bg-white/5 border-[var(--color-border)] flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={isPending || !link}
                  className="bg-[#3ea534] hover:bg-[#34932a] text-white h-12 px-8 rounded-lg font-bold"
                >
                  {isPending ? t('submitting') : t('submit')}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
