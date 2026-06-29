import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="relative bg-black border-t border-bone/10">
      <div className="mx-auto max-w-[1500px] px-6 sm:px-10 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Wordmark small className="text-bone/80" />
          <p className="label-track text-bone-faint text-[0.6rem] order-3 sm:order-2">
            A Global Creative Network
          </p>
          <p className="label-track text-bone-faint text-[0.6rem] order-2 sm:order-3">
            © MMXXVI — By Invitation
          </p>
        </div>
      </div>
    </footer>
  );
}
