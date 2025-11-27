/**
 * Safe render utilities to prevent preview crashes
 */

import React from 'react';

export function safeRender<T>(
  renderFn: () => T,
  fallback: T
): T {
  try {
    return renderFn()
  } catch (error) {
    console.error('Safe render caught error:', error)
    return fallback
  }
}

export function safeParse<T>(
  json: string,
  fallback: T
): T {
  try {
    return JSON.parse(json)
  } catch (error) {
    console.error('Safe parse caught error:', error)
    return fallback
  }
}

export function safeStringify(
  obj: any,
  fallback: string = '{}'
): string {
  try {
    return JSON.stringify(obj, null, 2)
  } catch (error) {
    console.error('Safe stringify caught error:', error)
    return fallback
  }
}

export function safeComponentRender<P>(
  Component: React.ComponentType<P>,
  props: P,
  fallback: React.ReactNode
): React.ReactNode {
  try {
    return React.createElement(Component, props)
  } catch (error) {
    console.error('Safe component render caught error:', error)
    return fallback
  }
}
