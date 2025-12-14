import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Maximize2, Minimize2, Monitor, Smartphone, Tablet } from 'lucide-react';

interface PreviewPanelProps {
  htmlCode: string | null;
  onClose: () => void;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const deviceWidths: Record<DeviceType, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

export function PreviewPanel({ htmlCode, onClose }: PreviewPanelProps) {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [device, setDevice] = useState<DeviceType>('desktop');

  const handleCopy = async () => {
    if (htmlCode) {
      await navigator.clipboard.writeText(htmlCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const DeviceButton = ({ type, icon: Icon }: { type: DeviceType; icon: typeof Monitor }) => (
    <button
      onClick={() => setDevice(type)}
      className={`p-2 rounded-lg transition-colors ${
        device === type
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted'
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <AnimatePresence>
      {htmlCode && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`fixed right-0 top-0 h-full bg-surface-elevated border-l border-border flex flex-col z-50 ${
            isFullscreen ? 'w-full' : 'w-[55%]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-4">
              <h3 className="font-semibold text-foreground">Preview</h3>
              <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                <DeviceButton type="desktop" icon={Monitor} />
                <DeviceButton type="tablet" icon={Tablet} />
                <DeviceButton type="mobile" icon={Smartphone} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preview Frame */}
          <div className="flex-1 p-4 bg-surface-sunken overflow-hidden">
            <div
              className="h-full bg-background rounded-lg shadow-lg overflow-hidden mx-auto transition-all duration-300"
              style={{ maxWidth: deviceWidths[device] }}
            >
              <iframe
                srcDoc={htmlCode}
                title="Website Preview"
                className="w-full h-full border-0"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
