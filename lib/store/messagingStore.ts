import { create } from "zustand";

interface MessagingStore {

  unreadCount:number;

  increment:() => void;

  decrement:() => void;

  setUnreadCount:(
    count:number
  ) => void;
}

export const useMessagingStore =
create<MessagingStore>(
(set)=>({

  unreadCount:0,

  increment:()=>
    set(state=>({

      unreadCount:
        state.unreadCount + 1

    })),

  decrement:()=>
    set(state=>({

      unreadCount:
      Math.max(
        0,
        state.unreadCount - 1
      )

    })),

  setUnreadCount:(count)=>
    set({
      unreadCount:count
    })

}))