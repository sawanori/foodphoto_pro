interface NetworkConnection {
  effectiveType?: string
  addEventListener?: (type: string, listener: () => void) => void
  removeEventListener?: (type: string, listener: () => void) => void
}

declare global {
  interface Navigator {
    connection?: NetworkConnection
    mozConnection?: NetworkConnection
    webkitConnection?: NetworkConnection
  }
}

export {}