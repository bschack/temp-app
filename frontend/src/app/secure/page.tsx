'use client'

import { useModal } from "@/components";
import { CompanySearch } from "@/components/companySearch";
import { useSessionContext } from "@/context/SessionContext";


export default function Secure() {
  const { session } = useSessionContext();
  const { Modal, openModal, closeModal, isOpen } = useModal({ header: 'Search', children: <CompanySearch /> });

  if (session) {
    return (
      <main>
        <section>
          <button onClick={openModal}>Open Modal</button>
          {Modal}
        </section>
      </main>
    )
  }
  
  return <h1>No User Permission</h1>
}
