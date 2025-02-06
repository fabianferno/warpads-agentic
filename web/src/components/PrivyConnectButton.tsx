'use client';

import SwitchNetwork from './SwitchNetwork';
import { usePrivy, } from '@privy-io/react-auth';
import { UserPill } from '@privy-io/react-auth/ui';



export default function PrivyConnectButton() {
  // Privy hooks
  const { ready, user, authenticated, login, connectWallet, logout, linkWallet } = usePrivy();

  if (!ready) {
    return null;
  }

  return (
    <div className='flex justify-end items-center gap-2'>
      <UserPill ui={{ background: "secondary" }} />
      <SwitchNetwork />
    </div>
  )
}
