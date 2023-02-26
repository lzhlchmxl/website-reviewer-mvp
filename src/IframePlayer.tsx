import { useEffect, useRef } from 'react';
// import Iframe from 'react-iframe'; // [TODO] remove package

export default function IframePlayer({reviewLink}: {reviewLink: string}) {

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', () => {
        const contentWindow = iframe.contentWindow;
        if (contentWindow) {
          contentWindow.document.addEventListener('click', handleIframeClick);
        }
      });
    }

    return () => {
      if (iframeRef.current && iframeRef.current.contentWindow !== null) {
        iframeRef.current.contentWindow.document.removeEventListener('click', handleIframeClick);
      }
    }
  }, [])

  const handleIframeClick = (e: any) => {
    const message = {
      type: 'elementClick',
      target: e.currentTarget.tagName,
    }

    window.parent.postMessage(message, '*');
  }

  return (
    <iframe
      ref={iframeRef}
      src={reviewLink}
      id=""
      className="w-full grow"
    />
  )
}