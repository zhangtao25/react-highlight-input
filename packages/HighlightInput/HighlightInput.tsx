import './styles/index.css';

import React, { useMemo, useState } from 'react';

interface HighlightRule {
  pattern: RegExp | string;
  class: any;
  tooltip: any;
}
export type HighlightInputProps = {
  value: string;
  onChange: (value: string) => void;
  highlight: HighlightRule;
};

const HighlightInput: React.FC<HighlightInputProps> = ({
  value,
  onChange,
  highlight,
}) => {
  const [test, setTest] = useState(-1);
  const defaultValue = useMemo(() => value, []);
  const normalArr = value
    .replace(highlight.pattern, '&&&')
    .split('&&&')
    .map((i) => ({
      class: 'normal',
      value: i,
      tooltip: highlight.tooltip,
    }));
  // @ts-ignore
  const regArr = (value.match(highlight.pattern)||[]).map((i) => ({
    class: highlight.class(i),
    value: i,
    tooltip: highlight.tooltip,
  }));
  const zongArr = [];
  for (let i = 0; i < regArr.length; i++) {
    zongArr.push(normalArr[i]);
    zongArr.push(regArr[i]);

    if (regArr.length - 1 === i) {
      zongArr.push(normalArr[i + 1]);
    }
  }
  return (
    <div className={'highlight-input'}>
      <div className={'display-input input'}>
        {
          zongArr.length>0?zongArr.map((i, index) => {
            return (
              <div
                data-name={index}
                key={index}
                style={{
                  position: 'relative',
                }}
                className={i.class}
              >
                <span
                  style={{
                    opacity: test === index && i.class !== 'normal' ? '0.7' : '1',
                  }}
                >
                  {i.value}
                </span>
  
                <div
                  className={'rhi-tooltip'}
                  style={{
                    display:
                      test === index && i.class !== 'normal' ? 'block' : 'none',
                  }}
                  onMouseMove={() => {
                    setTest(index);
                  }}
                  onMouseOut={() => {
                    setTest(-1);
                  }}
                >
                  <div className='value'>{i.tooltip(i.value)}</div>
                  <div className='dianpian'>
                    <div className="sanjiao"></div>
                  </div>
                </div>
              </div>
            );
          }):<div>{value}</div>
        }
      </div>
      <div
        className={'real-input input'}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onKeyDown={(e) => {
          if (e.code === 'Enter') {
            e.preventDefault();
            return false;
          }
        }}
        onInput={(v) => {
          // @ts-ignore
          onChange(v.target.innerHTML);
        }}
        onMouseMove={(e) => {
          // console.log('进入',document.elementsFromPoint(e.clientX, e.clientY))
          let str = document
            .elementsFromPoint(e.clientX, e.clientY)[1]
            .getAttribute('data-name');

            if(str === null){
              str = document
              .elementsFromPoint(e.clientX, e.clientY)[2]
              .getAttribute('data-name');
            }

          if (str) {
            // console.log(str)
            setTest(Number(str));
          }
        }}
        onMouseOut={() => {
          setTest(-1);
        }}
      >
        {defaultValue}
      </div>
    </div>
  );
};

export default HighlightInput;
