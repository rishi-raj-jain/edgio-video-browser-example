import Link from 'next/link'
import { Prefetch } from '@layer0/react'
import { relativizeURL } from '@/lib/helper'
import { createNextDataURL } from '@layer0/next/client'

const Item = ({ id, name, image }) => {
  return (
    <Link href={`/show/${id}`}>
      <Prefetch
        url={createNextDataURL({
          href: `/show/${id}`,
          routeParams: { id },
        })}
      >
        <a className="w-[150px]" href={`/show/${id}`}>
          <div
            className="flex flex-col"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.homeScrollLeave = window.scrollY
              }
            }}
          >
            <img className="h-auto w-full" src={relativizeURL(image.hasOwnProperty('medium') ? image['medium'] : image['original'])} />
            <h3 className="mt-3 max-w-[200px] text-gray-300">{name}</h3>
          </div>
        </a>
      </Prefetch>
    </Link>
  )
}

export default Item
