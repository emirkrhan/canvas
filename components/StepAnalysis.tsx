import React, { useEffect, useState } from 'react';
import { ExtractedData } from '../types';
import { extractArticleData, extractArticleFromPdf } from '../services/apiService';

interface StepAnalysisProps {
  onComplete: (data?: ExtractedData) => void;
  url?: string | null;
  pdfFile?: File | null;
}

const StepAnalysis: React.FC<StepAnalysisProps> = ({ onComplete, url, pdfFile }) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Fake progress animation function
    const animateProgress = () => {
        const interval = setInterval(() => {
            if (!isMounted) {
                clearInterval(interval);
                return;
            }
            setProgress((prev) => {
                // Stall at 90% if loading
                if (prev >= 90) return prev;
                return prev + 1;
            });
        }, 50);
        return interval;
    };

    const runAnalysis = async () => {
        const interval = animateProgress();

        if (pdfFile) {
            try {
                const data = await extractArticleFromPdf(pdfFile);
                if (isMounted) {
                    clearInterval(interval);
                    setProgress(100);
                    setTimeout(() => onComplete(data), 800);
                }
            } catch (err) {
                if (isMounted) {
                    clearInterval(interval);
                    setError(err instanceof Error ? err.message : 'PDF analysis failed');
                }
            }
        } else if (url) {
            try {
                const data = await extractArticleData(url);
                if (isMounted) {
                    clearInterval(interval);
                    setProgress(100);
                    setTimeout(() => onComplete(data), 800);
                }
            } catch (err) {
                if (isMounted) {
                    clearInterval(interval);
                    setError(err instanceof Error ? err.message : 'Analysis failed');
                }
            }
        } else {
            // Mock simulation for demo/no-url path
            setTimeout(() => {
                if (isMounted) {
                    clearInterval(interval);
                    setProgress(100);
                    setTimeout(() => onComplete(), 800);
                }
            }, 3000);
        }
    };

    runAnalysis();

    return () => { isMounted = false; };
  }, [onComplete, url, pdfFile]);

  if (error) {
      return (
          <div className="flex flex-col items-center justify-center gap-4 w-full h-96 text-center animate-fade-in">
              <div className="size-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl">error</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-text-dark">Bir Hata Oluştu</h3>
              <p className="text-neutral-text-light max-w-md">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-bold"
              >
                  Tekrar Dene
              </button>
          </div>
      )
  }

  return (
    <div className="flex flex-col gap-4 w-full mx-auto animate-fade-in-up">
      {/* Page Heading */}
      <div className="flex flex-col gap-1 text-center mb-2">
          <p className="text-2xl font-black leading-tight tracking-tight text-neutral-text-dark">
            {pdfFile ? 'PDF dosyanız analiz ediliyor...' : url ? 'Yayınınız analiz ediliyor...' : 'Demo analiz başlatılıyor...'}
          </p>
          <p className="text-sm text-neutral-text-light max-w-2xl mx-auto">
            Yapay zekamız anahtar içeriği çıkarıyor, şekilleri tanımlıyor ve mükemmel grafiksel özeti oluşturmak için verileri yapılandırıyor.
          </p>
      </div>

      {/* File Info Card */}
      <div className="bg-white rounded-xl shadow-md border border-white/20 p-3 flex items-center gap-3 relative overflow-hidden">
        <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-500 text-white shadow-md shadow-primary/30 shrink-0">
            <span className="material-symbols-outlined text-xl">{pdfFile ? 'picture_as_pdf' : url ? 'link' : 'article'}</span>
        </div>
        <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-neutral-text-dark truncate">
                {pdfFile ? pdfFile.name : url ? url : 'kuantum_dolaniklik_incelemesi_2023.pdf'}
            </h3>
            <p className="text-xs text-neutral-text-light">
                {pdfFile ? `${(pdfFile.size / (1024 * 1024)).toFixed(2)} MB • PDF` : url ? 'Web Sitesi' : '2.4 MB • PDF'}
            </p>
        </div>
        <div className="shrink-0">
             <div className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-green-100 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
                İşleniyor
             </div>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-text-light">İlerleme</p>
          <p className="text-xl font-black text-primary">{progress}%</p>
        </div>
        <div className="rounded-full bg-gray-100 h-3 overflow-hidden shadow-inner p-0.5">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-primary to-purple-500 relative transition-all duration-200 ease-out shadow-sm" 
            style={{ width: `${progress}%` }}
          >
            <div className="progress-shimmer absolute inset-0 opacity-40"></div>
          </div>
        </div>
      </div>

      {/* Detailed Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Steps Timeline */}
        <div className="flex flex-col gap-2.5">
            {[
                { label: 'Belge Yapısı Ayrıştırılıyor', icon: 'verified', threshold: 25 },
                { label: 'Metin ve Anahtar Kelimeler Çıkarılıyor', icon: 'text_fields', threshold: 50 },
                { label: 'Şekiller ve Tablolar Tanımlanıyor', icon: 'image_search', threshold: 75 },
                { label: 'Düzen Önerileri Oluşturuluyor', icon: 'auto_awesome_mosaic', threshold: 95 }
            ].map((step, idx) => {
                const isCompleted = progress > step.threshold;
                const isCurrent = progress <= step.threshold && progress > (step.threshold - 25);
                const isPending = progress <= (step.threshold - 25);

                return (
                    <div 
                        key={idx}
                        className={`
                            flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all duration-500
                            ${isCurrent 
                                ? 'bg-white border-primary shadow-md scale-[1.01] shadow-primary/5' 
                                : isCompleted 
                                    ? 'bg-white border-neutral-border opacity-70' 
                                    : 'bg-transparent border-transparent opacity-50'
                            }
                        `}
                    >
                        <div className={`
                            flex items-center justify-center rounded-lg shrink-0 size-8 transition-colors duration-500
                            ${isCompleted ? 'bg-green-100 text-green-600' : isCurrent ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-gray-100 text-gray-400'}
                        `}>
                            <span className="material-symbols-outlined text-lg">
                                {isCompleted ? 'check' : step.icon}
                            </span>
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                            <p className={`text-xs font-bold transition-colors truncate ${isCurrent ? 'text-primary' : 'text-neutral-text-dark'}`}>
                                {step.label}
                            </p>
                            <p className="text-[10px] font-medium text-neutral-text-light">
                                {isCompleted ? 'Tamamlandı' : isCurrent ? 'Devam Ediyor...' : 'Beklemede'}
                            </p>
                        </div>
                        {isCurrent && (
                            <div className="shrink-0">
                                <span className="flex size-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full size-2 bg-primary"></span>
                                </span>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>

        {/* Right Column: AI Insights Panel */}
        <div className="flex flex-col h-full">
            <div className="bg-gradient-to-b from-primary/5 to-transparent border border-primary/10 rounded-xl p-4 h-full flex flex-col gap-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 border-b border-primary/10 pb-2">
                  <span className="material-symbols-outlined text-primary animate-pulse-slow text-lg">psychology</span>
                  <h3 className="text-sm font-bold text-neutral-text-dark">Yapay Zeka Görüşleri</h3>
              </div>
              
              <ul className="space-y-2.5 flex-1">
                {progress > 15 && (
                    <li className="flex gap-2 animate-slide-in-right">
                        <span className="material-symbols-outlined text-green-500 text-sm mt-0.5">check_circle</span>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-bold text-neutral-text-dark">Belge Türü Tanımlandı</span>
                            <span className="text-[10px] text-neutral-text-light">İçerik başarıyla tanımlandı.</span>
                        </div>
                    </li>
                )}
                {progress > 45 && (
                    <li className="flex gap-2 animate-slide-in-right" style={{animationDelay: '0.1s'}}>
                        <span className="material-symbols-outlined text-green-500 text-sm mt-0.5">check_circle</span>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-bold text-neutral-text-dark">Anahtar Bulgular Çıkarıldı</span>
                            <span className="text-[10px] text-neutral-text-light">Özet bölümleri ve metadata ayrıştırıldı.</span>
                        </div>
                    </li>
                )}
                 {progress > 80 && (
                    <li className="flex gap-2 animate-slide-in-right" style={{animationDelay: '0.2s'}}>
                        <span className="material-symbols-outlined text-green-500 text-sm mt-0.5">check_circle</span>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-bold text-neutral-text-dark">Görsel Varlıklar Hazır</span>
                            <span className="text-[10px] text-neutral-text-light">İkon önerileri oluşturuldu.</span>
                        </div>
                    </li>
                )}
              </ul>

              <div className="text-[10px] text-center text-primary/60 font-medium bg-primary/5 py-1.5 rounded">
                  Gemini 1.5 Pro tarafından desteklenmektedir
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StepAnalysis;