import { Tabs } from 'antd'
import { ReactNode, useRef, useState } from 'react'

type TargetKey = React.MouseEvent | React.KeyboardEvent | string

const getInitialItems = (children: ReactNode, title: string) => [
  { label: `${title}-client 1`, children: children, key: '1' },
]

type TDemoPage = {
  children: ReactNode
  title: string
}

export const DemoPage = ({ children, title }: TDemoPage) => {
  const initialItems = getInitialItems(children, title)
  const [activeKey, setActiveKey] = useState(initialItems[0].key)
  const [items, setItems] = useState(initialItems)
  const newTabIndex = useRef(0)

  const onChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey)
  }

  const add = () => {
    const newActiveKey = `${title}-client${newTabIndex.current++}`
    const newPanes = [...items]
    newPanes.push({
      label: `${title} client ${newTabIndex.current + 1}`,
      children,
      key: newActiveKey,
    })
    setItems(newPanes)
    setActiveKey(newActiveKey)
  }

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey
    let lastIndex = -1
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1
      }
    })
    const newPanes = items.filter((item) => item.key !== targetKey)
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key
      } else {
        newActiveKey = newPanes[0].key
      }
    }
    setItems(newPanes)
    setActiveKey(newActiveKey)
  }

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove'
  ) => {
    if (action === 'add') {
      add()
    } else {
      remove(targetKey)
    }
  }
  return (
    <Tabs
      type='editable-card'
      onChange={onChange}
      activeKey={activeKey}
      onEdit={onEdit}
      items={items}
    />
  )
}
