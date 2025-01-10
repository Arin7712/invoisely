import { Button } from '@/components/ui/button'
import { features } from 'process'
import React from 'react'

const Features = () => {
  return (
    <section className="flex p-8 md:p-0 flex-col gap-[2.2rem] md:gap-[2.2rem] md:items-center justify-between mt-[4rem] py-12 lg:py-20">
        <div className="text-neutral-300 bg-neutral-900 border-[1px] inline-block  uppercase border-zinc-700 px-3 py-1.5 rounded-md text-xs font-semibold">
              <p>Features</p>
        </div>
        <div className='text-5xl font-bold text-neutral-300'>
            Save Time, <span className='italic text-neutral-500 font-light'>make more money</span>
        </div>
        <div className='max-w-2xl'>
            <p className='text-neutral-500 text-center'>SaaAI offers essential features to streamline operations and enhance productivity. Key tools include task management, campaign launch, code deployment, data integration, analytics, security, project tracking, and integrations.</p>
        </div>
        <div>
        <Button className="bg-matt2 border-zinc-700 border-[1px] text-lg">Get Started</Button>
      </div>

      <div className='grid grid-cols-4 gap-4'>
        
      </div>
    </section>
  )
}

export default Features
