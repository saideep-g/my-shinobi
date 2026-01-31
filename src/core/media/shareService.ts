import html2canvas from 'html2canvas';

/**
 * SHARE SERVICE
 * Orchestrates the conversion of DOM elements to images and triggers native sharing.
 * Enables students to provide "Proof of Progress" to parents/mentors.
 */

export const shareService = {
    /**
     * Captures a DOM tree and converts it to a PNG binary.
     * Handles scale adjustments for high-density mobile displays.
     */
    async generateImageBlob(elementId: string): Promise<Blob | null> {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`[ShareService] Element not found: ${elementId}`);
            return null;
        }

        try {
            // Create canvas from DOM element
            const canvas = await html2canvas(element, {
                scale: 3, // Premium quality for sharing
                backgroundColor: null,
                logging: false,
                useCORS: true, // Allow external assets (like icons) if needed
                onclone: (clonedDoc) => {
                    // Optional: Modify the clone before capture (e.g., ensure visibility)
                    const clonedEl = clonedDoc.getElementById(elementId);
                    if (clonedEl) {
                        clonedEl.style.opacity = '1';
                        clonedEl.style.pointerEvents = 'auto';
                    }
                }
            });

            // Export to Blob
            return new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/png', 1.0);
            });
        } catch (error) {
            console.error("[ShareService] Image generation crash:", error);
            return null;
        }
    },

    /**
     * Invokes the system share sheet (Web Share API).
     * Falls back to a local download if sharing is blocked or unsupported.
     */
    async shareImage(blob: Blob, title: string, text: string): Promise<void> {
        const fileName = 'shinobi-progress.png';
        const file = new File([blob], fileName, { type: 'image/png' });

        // Check if device supports direct file sharing
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    title,
                    text,
                    files: [file],
                });
            } catch (error) {
                // Handle user cancellation or API rejection
                if ((error as any).name !== 'AbortError') {
                    console.warn("[ShareService] Share API failed, falling back to download:", error);
                    this.downloadImage(blob, fileName);
                }
            }
        } else {
            console.log("[ShareService] Sharing unsupported. Triggering download.");
            this.downloadImage(blob, fileName);
        }
    },

    /**
     * Universal fallback for non-mobile or legacy browsers.
     */
    downloadImage(blob: Blob, fileName: string) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};
