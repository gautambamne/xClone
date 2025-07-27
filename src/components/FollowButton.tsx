'use client'
import { followUser } from '@/action';
import React, { useOptimistic, useState } from 'react'


export default function FollowButton({userId, isFollowed}:{userId:string, isFollowed:boolean}) {
  const [state, setState] = useState(isFollowed)
  const followAction = async () => {
    switchOptimisticState("");
    await followUser(userId);
    setState((prev) => !prev);
  };
  const [optimisticState, switchOptimisticState] = useOptimistic(
    state,
    (prev) => !prev
  );
  return (
    
      <form action={followAction}>
          <button className="py-2 px-4 bg-white text-black font-bold rounded-full">
            {isFollowed ? "Unfollow": "Follow"}
          </button>
      </form>
    
  )
  }
