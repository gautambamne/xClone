'use client'
import React from 'react'

export default function FollowButton({userId, isFollowed}:{userId:string, isFollowed:boolean}) {
  return (
    <div>
          <button className="py-2 px-4 bg-white text-black font-bold rounded-full">
            {isFollowed ? "Unfollow": "Follow"}
          </button>
      
    </div>
  )
}
