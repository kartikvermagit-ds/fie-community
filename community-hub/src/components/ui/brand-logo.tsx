'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BrandLogoProps {
  variant?: 'full' | 'symbol' | 'compact' | 'monochrome';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  withGlow?: boolean;
  className?: string;
  asLink?: boolean;
  href?: string;
}

const sizeConfig = {
  xs: { symbolSize: 22, textSize: 'text-sm', badgeSize: 'text-[9px]', fullWidth: 120, fullHeight: 96 },
  sm: { symbolSize: 28, textSize: 'text-base', badgeSize: 'text-[9px]', fullWidth: 150, fullHeight: 120 },
  md: { symbolSize: 36, textSize: 'text-lg', badgeSize: 'text-[10px]', fullWidth: 190, fullHeight: 152 },
  lg: { symbolSize: 48, textSize: 'text-xl', badgeSize: 'text-xs', fullWidth: 240, fullHeight: 192 },
  xl: { symbolSize: 72, textSize: 'text-3xl', badgeSize: 'text-xs', fullWidth: 320, fullHeight: 256 },
};

export function BrandLogo({
  variant = 'compact',
  size = 'md',
  showSubtitle = true,
  withGlow = true,
  className = '',
  asLink = false,
  href = '/',
}: BrandLogoProps) {
  const config = sizeConfig[size];

  const content = (
    <div className={`inline-flex items-center gap-3 select-none group relative ${className}`}>
      {/* Immersive background glow */}
      {withGlow && (
        <div 
          aria-hidden="true"
          className="absolute -inset-2 bg-gradient-to-r from-orange-500/20 via-transparent to-blue-500/20 rounded-2xl blur-md opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none"
        />
      )}

      {variant === 'symbol' && (
        <div className="relative flex items-center justify-center shrink-0">
          <Image
            src="/brand/fie-symbol.png"
            alt="FIE Community official emblem"
            width={config.symbolSize}
            height={config.symbolSize}
            priority
            className="w-auto h-auto object-contain transition-transform group-hover:scale-105 duration-200"
            style={{ width: `${config.symbolSize}px`, height: `${config.symbolSize}px` }}
          />
        </div>
      )}

      {variant === 'monochrome' && (
        <div className="relative flex items-center justify-center shrink-0">
          <Image
            src="/brand/fie-symbol-monochrome.png"
            alt="FIE Community monochrome emblem"
            width={config.symbolSize}
            height={config.symbolSize}
            className="w-auto h-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
            style={{ width: `${config.symbolSize}px`, height: `${config.symbolSize}px` }}
          />
        </div>
      )}

      {variant === 'full' && (
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative overflow-hidden rounded-2xl p-2 bg-[#080B10]/90 border border-white/10 shadow-[0_0_30px_-5px_rgba(249,115,22,0.25)]">
            <Image
              src="/brand/fie-logo-transparent.png"
              alt="FIE COMMUNITY — Official Brand Logo"
              width={config.fullWidth}
              height={config.fullHeight}
              priority
              className="object-contain transition-transform group-hover:scale-102 duration-300"
            />
          </div>
        </div>
      )}

      {variant === 'compact' && (
        <>
          <div className="relative shrink-0 flex items-center justify-center p-1 rounded-xl bg-gradient-to-br from-orange-500/15 via-black/40 to-blue-500/15 border border-white/10 group-hover:border-orange-500/40 shadow-[0_0_15px_-3px_rgba(249,115,22,0.3)] transition-all">
            <Image
              src="/brand/fie-symbol.png"
              alt="FIE Community official emblem"
              width={config.symbolSize}
              height={config.symbolSize}
              priority
              className="w-auto h-auto object-contain transition-transform group-hover:scale-105"
              style={{ width: `${config.symbolSize}px`, height: `${config.symbolSize}px` }}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className={`font-heading font-black tracking-tight text-white uppercase leading-none ${config.textSize}`}>
                FIE <span className="text-white">COMMUNITY</span>
              </span>
              <span className={`font-mono px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-400 border border-orange-500/30 font-bold ${config.badgeSize}`}>
                2026
              </span>
            </div>
            {showSubtitle && (
              <span className="text-[10px] font-mono tracking-wider text-slate-400 mt-1 uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse inline-block" />
                Connect · Collaborate · Create
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
