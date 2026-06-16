"use client"

import { useEffect } from "react"

export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".pw-reveal")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setTimeout(() => e.target.classList.add("pw-visible"), 120)
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
