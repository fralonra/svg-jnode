const NAME_SPACE = 'http://www.w3.org/2000/svg'

interface ISVGJNodeJsonObject {
  tag: keyof SVGElementTagNameMap
  description?: string
  attrs: {
    [key: string]: string | number
  }
  children?: SVGJNode[]
}

class SVGJNode {
  attrs: {
    [key: string]: string | number
  } = {}
  children: SVGJNode[] = []

  static fromJson(json: ISVGJNodeJsonObject): SVGJNode {
    // TODO: validate json object
    const node = new SVGJNode(json.tag, json.description)
    for (const attr in json.attrs) {
      node.set(attr, json.attrs[attr])
    }
    if (json.children && json.children.length) {
      json.children.forEach((child) => {
        node.addChild(SVGJNode.fromJson(child))
      })
    }
    return node
  }

  constructor(
    public tag: keyof SVGElementTagNameMap,
    public description: string = ''
  ) {}

  addChild(child: SVGJNode): void {
    this.children.push(child)
  }

  set(key: string, value: string | number): void {
    this.attrs[key] = value
  }

  toElement(
    callback?: (element: SVGElement, node: SVGJNode) => void
  ): SVGElement {
    if (!window || !window.document) {
      throw new Error('"window" or "window.document" is undefined.')
    }
    const el = document.createElementNS(NAME_SPACE, this.tag)
    for (const attr in this.attrs) {
      const namespace =
        attr.split(':')[0] === 'xmlns' ? 'http://www.w3.org/2000/xmlns/' : null
      el.setAttributeNS(namespace, attr, String(this.attrs[attr]))
    }
    for (const child of this.children) {
      el.appendChild(child.toElement(callback))
    }

    if (callback) {
      callback(el, this)
    }
    return el
  }
}

export { SVGJNode, ISVGJNodeJsonObject }
