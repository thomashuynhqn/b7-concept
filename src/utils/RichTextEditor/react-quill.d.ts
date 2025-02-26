declare module 'react-quill' {
    import { Component } from 'react';
  
    export interface ReactQuillProps {
      value?: string;
      defaultValue?: string;
      placeholder?: string;
      readOnly?: boolean;
      theme?: string;
      modules?: object;
      formats?: string[];
      bounds?: string | HTMLElement;
      children?: React.ReactNode;
      onChange?: (
        value: string,
        delta: any,
        source: string,
        editor: any
      ) => void;
      onFocus?: (range: any, source: string, editor: any) => void;
      onBlur?: (previousRange: any, source: string, editor: any) => void;
      onKeyPress?: React.EventHandler<any>;
    }
  
    export default class ReactQuill extends Component<ReactQuillProps> {}
  }
  