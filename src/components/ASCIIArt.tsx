'use client';

import { useEffect, useRef, useState } from 'react';

interface ASCIIArtProps {
  onComplete: () => void;
}

export function ASCIIArt({ onComplete }: ASCIIArtProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!containerRef.current || isComplete) return;
    setIsComplete(true);

    const art = `
                                 <span style="color: #6366f1">═══════════</span>
                             <span style="color: #6366f1">═══</span><span style="color: #888">╔═══════════╗</span><span style="color: #6366f1">═══</span>
                          <span style="color: #6366f1">═══</span><span style="color: #888">╔══╝</span>    <span style="color: #6366f1">█████</span>    <span style="color: #888">╚══╗</span><span style="color: #6366f1">═══</span>
                       <span style="color: #6366f1">═══</span><span style="color: #888">╔══╝</span>   <span style="color: #6366f1">████</span><span style="color: #888">@@@</span><span style="color: #6366f1">████</span>   <span style="color: #888">╚══╗</span><span style="color: #6366f1">═══</span>
                    <span style="color: #6366f1">═══</span><span style="color: #888">╔══╝</span>   <span style="color: #6366f1">███</span><span style="color: #888">@@@@@@@</span><span style="color: #6366f1">███</span>   <span style="color: #888">╚══╗</span><span style="color: #6366f1">═══</span>
                 <span style="color: #6366f1">═══</span><span style="color: #888">╔══╝</span>   <span style="color: #6366f1">████</span><span style="color: #888">@@@@@@@</span><span style="color: #6366f1">████</span>   <span style="color: #888">╚══╗</span><span style="color: #6366f1">═══</span>
              <span style="color: #6366f1">═══</span><span style="color: #888">╔══╝</span>    <span style="color: #6366f1">████</span><span style="color: #888">@@@</span><span style="color: #c8c8d0">▓▓▓</span><span style="color: #888">@@@</span><span style="color: #6366f1">████</span>    <span style="color: #888">╚══╗</span><span style="color: #6366f1">═══</span>
           <span style="color: #6366f1">═══</span><span style="color: #888">╔══╝</span>   <span style="color: #6366f1">█████</span><span style="color: #888">@@</span><span style="color: #c8c8d0">▓▓█▓█▓▓</span><span style="color: #888">@@</span><span style="color: #6366f1">█████</span>   <span style="color: #888">╚══╗</span><span style="color: #6366f1">═══</span>
        <span style="color: #6366f1">═══</span><span style="color: #888">╔══╝</span>    <span style="color: #6366f1">██████</span><span style="color: #888">@</span><span style="color: #c8c8d0">▓▓███████▓▓</span><span style="color: #888">@</span><span style="color: #6366f1">██████</span>    <span style="color: #888">╚══╗</span><span style="color: #6366f1">═══</span>
     <span style="color: #6366f1">═══</span><span style="color: #888">╔══╝</span>    <span style="color: #6366f1">███████</span><span style="color: #888">@</span><span style="color: #c8c8d0">▓█████████████▓</span><span style="color: #888">@</span><span style="color: #6366f1">███████</span>    <span style="color: #888">╚══╗</span><span style="color: #6366f1">═══</span>
     <span style="color: #888">║</span><span style="color: #6366f1">═══</span><span style="color: #888">╚═══════╝</span><span style="color: #c8c8d0">▓▓███████████████▓▓</span><span style="color: #888">╚═══════╝</span><span style="color: #6366f1">═══</span><span style="color: #888">║</span>
     <span style="color: #888">║</span>       <span style="color: #c8c8d0">▓▓████████████████████▓▓</span>       <span style="color: #888">║</span>
     <span style="color: #888">║</span>     <span style="color: #c8c8d0">▓▓██████████████████████████▓▓</span>     <span style="color: #888">║</span>
     <span style="color: #888">║</span>    <span style="color: #c8c8d0">▓███████████████████████████████▓</span>    <span style="color: #888">║</span>
     <span style="color: #888">║</span>   <span style="color: #c8c8d0">▓████████</span><span style="color: #6366f1">████████████</span><span style="color: #c8c8d0">████████▓</span>   <span style="color: #888">║</span>
     <span style="color: #888">║</span>  <span style="color: #c8c8d0">▓█████████</span><span style="color: #6366f1">██████  ██████</span><span style="color: #c8c8d0">█████████▓</span>  <span style="color: #888">║</span>
     <span style="color: #888">║</span>  <span style="color: #c8c8d0">▓█████████</span><span style="color: #6366f1">█████    █████</span><span style="color: #c8c8d0">█████████▓</span>  <span style="color: #888">║</span>
     <span style="color: #888">║</span>  <span style="color: #c8c8d0">▓█████████</span><span style="color: #6366f1">████      ████</span><span style="color: #c8c8d0">█████████▓</span>  <span style="color: #888">║</span>
     <span style="color: #888">║</span>  <span style="color: #c8c8d0">▓██████████</span><span style="color: #6366f1">██        ██</span><span style="color: #c8c8d0">██████████▓</span>  <span style="color: #888">║</span>
     <span style="color: #888">║</span>  <span style="color: #c8c8d0">▓███████████</span><span style="color: #6366f1">██      ██</span><span style="color: #c8c8d0">███████████▓</span>  <span style="color: #888">║</span>
     <span style="color: #888">║</span>   <span style="color: #c8c8d0">▓███████████</span><span style="color: #6366f1">██    ██</span><span style="color: #c8c8d0">███████████▓</span>   <span style="color: #888">║</span>
     <span style="color: #888">║</span>    <span style="color: #c8c8d0">▓███████████</span><span style="color: #6366f1">██████</span><span style="color: #c8c8d0">███████████▓</span>    <span style="color: #888">║</span>
     <span style="color: #888">║</span>     <span style="color: #c8c8d0">▓█████████████████████████▓</span>     <span style="color: #888">║</span>
     <span style="color: #888">║</span>      <span style="color: #c8c8d0">▓███████████████████████▓</span>      <span style="color: #888">║</span>
     <span style="color: #888">║</span>        <span style="color: #c8c8d0">▓█████████████████████▓</span>        <span style="color: #888">║</span>
     <span style="color: #888">║</span>         <span style="color: #c8c8d0">▓██████████████████▓</span>         <span style="color: #888">║</span>
     <span style="color: #888">║</span>           <span style="color: #c8c8d0">▓██████</span><span style="color: #6366f1">████</span><span style="color: #c8c8d0">██████▓</span>           <span style="color: #888">║</span>
     <span style="color: #888">║</span>            <span style="color: #c8c8d0">▓█████</span><span style="color: #6366f1">████</span><span style="color: #c8c8d0">█████▓</span>            <span style="color: #888">║</span>
     <span style="color: #888">║</span>             <span style="color: #c8c8d0">▓███</span><span style="color: #6366f1">██████</span><span style="color: #c8c8d0">███▓</span>             <span style="color: #888">║</span>
     <span style="color: #888">║</span>               <span style="color: #c8c8d0">▓██</span><span style="color: #6366f1">████</span><span style="color: #c8c8d0">██▓</span>               <span style="color: #888">║</span>
     <span style="color: #888">║</span>                <span style="color: #c8c8d0">▓</span><span style="color: #6366f1">██████</span><span style="color: #c8c8d0">▓</span>                <span style="color: #888">║</span>
     <span style="color: #888">║</span>                 <span style="color: #6366f1">██████</span>                 <span style="color: #888">║</span>
     <span style="color: #888">║</span>                 <span style="color: #6366f1">██  ██</span>                 <span style="color: #888">║</span>
     <span style="color: #888">║</span>                 <span style="color: #6366f1">██  ██</span>                 <span style="color: #888">║</span>
     <span style="color: #888">║</span>                <span style="color: #6366f1">███  ███</span>                <span style="color: #888">║</span>
     <span style="color: #888">║</span>               <span style="color: #6366f1">████  ████</span>               <span style="color: #888">║</span>
     <span style="color: #888">║</span>              <span style="color: #6366f1">█████  █████</span>              <span style="color: #888">║</span>
     <span style="color: #888">║</span>                                         <span style="color: #888">║</span>
     <span style="color: #888">╚═══════════════════════════════════════════╝</span>

                  <span style="color: #6366f1">╔═══════════════════════════╗</span>
                  <span style="color: #6366f1">║</span>    <span style="color: #c8c8d0">G A L L U P P I . A I</span>    <span style="color: #6366f1">║</span>
                  <span style="color: #6366f1">╚═══════════════════════════╝</span>
`;

    const container = containerRef.current;
    container.innerHTML = '';

    // Type out the ASCII art very fast
    const CHAR_DELAY = 0.5; // 0.5ms per character
    let charIndex = 0;
    let currentContent = '';

    function typeNextChar() {
      if (charIndex < art.length) {
        currentContent += art[charIndex];
        container.innerHTML = currentContent;
        charIndex++;
        setTimeout(typeNextChar, CHAR_DELAY);
      } else {
        // Art complete, pause then signal completion
        setTimeout(() => {
          onComplete();
        }, 1500);
      }
    }

    typeNextChar();
  }, [onComplete, isComplete]);

  return (
    <div className="flex items-center justify-center w-full py-8">
      <div 
        ref={containerRef} 
        className="font-mono text-xs md:text-sm leading-tight whitespace-pre text-center"
        style={{ textShadow: '0 0 8px rgba(200,200,208,0.15)' }}
      />
    </div>
  );
}
