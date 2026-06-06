"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import QuickPinchZoom, { make3dTransformValue } from "react-quick-pinch-zoom";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "../config/site";
import { projects, Project } from "../lib/projects";
import Image from "next/image";

export default function PortfolioPage() {
  const [filter, setFilter] = useState<Project["category"] | "all">("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showTopButton, setShowTopButton] = useState(false);

  // フィルタリングされた現在のリスト
  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter((p) => p.category === filter);

  // --- 送り・戻し機能のロジック ---
  const navigateProject = useCallback((direction: "next" | "prev") => {
    if (!selectedProject) return;
    
    const currentIndex = filteredProjects.findIndex(p => p.id === selectedProject.id);
    if (currentIndex === -1) return;

    let nextIndex;
    if (direction === "next") {
      nextIndex = (currentIndex + 1) % filteredProjects.length;
    } else {
      nextIndex = (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
    }
    
    setSelectedProject(filteredProjects[nextIndex]);
  }, [selectedProject, filteredProjects]);

  // キーボード操作への対応
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      if (e.key === "ArrowRight") navigateProject("next");
      if (e.key === "ArrowLeft") navigateProject("prev");
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, navigateProject]);

  // スクロール量監視
  useEffect(() => {
    const handleScroll = () => setShowTopButton(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    { id: "all", label: "すべて" },
    { id: "thumbnail", label: "YouTubeサムネイル" },
    { id: "banner", label: "Webバナー" },
    { id: "flyer", label: "A4チラシ" },
    { id: "web", label: "ウェブサイト" },
    { id: "illust", label: "イラスト" },
    { id: "movie", label: "動画" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl text-[#706745] font-bold tracking-tight italic">
            {siteConfig.name} <span className="text-gray-400 font-medium text-lg italic">Design Portfolio</span>
          </h1>
          
          <nav className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-lg">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id as any)}
                className={`px-4 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all ${
                  filter === cat.id 
                  ? "bg-white text-black shadow-sm" 
                  : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">
          Design Samples
        </h2>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-left md:text-left">
          <p className="text-gray-700 leading-loose text-sm md:text-base">
            {siteConfig.description}
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(project)}
                className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="aspect-[4/3] relative bg-gray-100">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white border border-white px-4 py-2 rounded-full text-sm">詳しく見る</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500 font-bold uppercase tracking-wider">
                      {catLabel(project.category)}
                    </span>
                    {project.time && (
                      <span className="text-xs text-gray-400">制作時間: {project.time}</span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg">{project.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 拡大表示用モーダル */}
<AnimatePresence>
  {selectedProject && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setSelectedProject(null)}
      className="fixed inset-0 z-[100] bg-black flex flex-col cursor-pointer overflow-hidden"
    >
      {/* 1. 画像表示エリア：画面の大部分を占める透明な箱 */}
      <div className="relative w-full flex-grow pointer-events-auto">
        <QuickPinchZoom
          onUpdate={({ x, y, scale }) => {
            const el = document.getElementById("zoom-target");
            if (el) el.style.transform = make3dTransformValue({ x, y, scale });
          }}
          draggableUnZoomed={false}
		  // @ts-ignore: enforceBounds exists in JS but no
          enforceBounds={false}
        >
          {/* 
             ここが重要です：
             コンテナを「画像の最大サイズ」と同じに固定し、
             その中で画像を 100% 表示させることで計算を一致させます。
          */}
          <div 
            id="zoom-target" 
            className="flex items-center justify-center w-screen h-[calc(100vh-160px)] md:h-[calc(100vh-200px)]"
          >
             <img
               src={selectedProject.image}
               alt={selectedProject.title}
               className="max-w-[90%] max-h-[90%] object-contain shadow-2xl"
               style={{
                 /* 特定IDの白枠トリミング */
                 clipPath: [81, 92, 119, 122].includes(selectedProject.id) 
                   ? "inset(1px 1px 1px 1px)" 
                   : "none"
               }}
               onClick={(e) => e.stopPropagation()}
             />
          </div>
        </QuickPinchZoom>
      </div>

      {/* 2. 下部操作パネル：高さを安定させる */}
      <div className="w-full h-[160px] md:h-[200px] px-4 flex flex-col justify-center text-white pointer-events-auto bg-black border-t border-white/10 z-[150]">
        <div className="max-w-3xl w-full mx-auto">
          {/* タイトル行 */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm md:text-xl font-bold truncate pr-4">
              {selectedProject.title}
            </h3>
			{selectedProject.link && (
					<a
						href={selectedProject.link}
						target="_blank"
						rel="noopener noreferrer"
						onClick={(e) => e.stopPropagation()} // モーダルが閉じるのを防ぐ
						className="inline-flex items-center gap-1 text-[11px] md:text-xs text-cyan-400 bg-cyan-950/50 border border-cyan-800/60 px-2.5 py-0.5 rounded hover:bg-cyan-400 hover:text-black transition-colors w-fit font-medium"
					>
						{selectedProject.category === "web" ? "サイトを見る ↗" : "YouTube動画を見る ↗"}
						
					</a>
					)}

            <button 
              onClick={() => setSelectedProject(null)} 
              className="text-[10px] md:text-xs text-gray-400 border border-gray-600 px-4 py-1.5 rounded-full hover:bg-white hover:text-black transition-colors"
            >
              閉じる ×
            </button>
          </div>

          {/* ナビゲーション行 */}
          <div className="flex items-center justify-between gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); navigateProject("prev"); }} 
              className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/10 border border-white/20 active:scale-95"
            >
              <span className="text-xl">❮</span>
            </button>
            
            <div className="flex flex-col items-center gap-1 text-[10px] md:text-xs text-gray-500">
              <span className="hidden md:inline-block opacity-40 mb-1">拡大：Ctrl + スクロール / ピンチ</span>
              <div className="flex items-center gap-3">
                <span className="bg-gray-800 px-2 py-0.5 rounded text-gray-300 uppercase tracking-widest">
                  {catLabel(selectedProject.category)}
                </span>
                <span className="font-mono">
                  {filteredProjects.findIndex(p => p.id === selectedProject.id) + 1} / {filteredProjects.length}
                </span>
              </div>
            </div>

            <button 
              onClick={(e) => { e.stopPropagation(); navigateProject("next"); }} 
              className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/10 border border-white/20 active:scale-95"
            >
              <span className="text-xl">❯</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>




      {/* ページトップボタン */}
      <AnimatePresence>
        {showTopButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 z-40 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:bg-gray-800 transition-colors"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>

      <footer className="border-t border-gray-200 py-16 text-center text-gray-400 text-sm">
        <p>{siteConfig.copyright}</p>
      </footer>
    </main>
  );
}

function catLabel(cat: string) {
  switch(cat) {
    case 'flyer': return 'A4チラシ';
    case 'thumbnail': return 'YouTubeサムネイル';
    case 'banner': return 'Webバナー';
    default: return cat;
  }
}