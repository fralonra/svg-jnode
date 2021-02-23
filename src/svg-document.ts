import type { SVGJNode } from './svg-jnode'

class SVGDocument {
  constructor(public root: SVGJNode) {}

  toElement(
    callback?: (element: SVGElement, node: SVGJNode) => void
  ): SVGElement {
    if (!this.root) {
      throw new Error('No root node found for document')
    }

    return this.root.toElement(callback)
  }
}

export { SVGDocument }
