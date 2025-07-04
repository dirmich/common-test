const round = (src, len) => {
  len = len === undefined ? 0 : len
  let exp = Math.pow(10, 0 + len)
  return Math.round(src * exp) / exp
}

const calculateSeatsAndLabelsPosition = ({
  row,
  rowWidth,
  dataCurve,
  startAngle,
  endAngle,
  gap,
  flipHor,
  flipVer,
  angle,
}) => {
  let _items = row.querySelectorAll('.seat-item')
  // let org_children = row.getInnerHTML()
  let org_children = row.innerHTML
  // Gap 적용하기
  let val = gap / $.lts.opts.canvas.seat.gapRate
  console.log('calc', gap, val)
  let _length = _items.length
  for (var idx = 1; idx < _length; idx++) {
    _items[idx]
      .querySelector('.seat-rect')
      .setAttribute('x', idx * $.lts.opts.canvas.seat.width + idx * val * 2)
    _items[idx]
      .querySelector('.seat-text')
      .setAttribute(
        'x',
        idx * $.lts.opts.canvas.seat.width +
          idx * val * 2 +
          $.lts.opts.canvas.seat.width * 0.5
      )
  }

  // 마지막 좌석의 위치는 자기 자신을 빼야 하므로 `좌석 넓이 * (전체좌석수-1)` 한다.
  rowWidth =
    $.lts.opts.canvas.seat.width * (_length - 1) + val * 2 * (_length - 1)
  row.style.width = rowWidth + $.lts.opts.canvas.seat.width / 2 + 'px' //

  if (flipHor === 'X' || flipVer === 'Y') {
    $.lts.cvs.select.setRotationDegree($(row), 0)

    startAngle = startAngle < 180 ? 360 - startAngle : 180 - (startAngle - 180)
    endAngle = endAngle < 180 ? 360 - endAngle : 180 - (endAngle - 180)
    ;[startAngle, endAngle] = [endAngle, startAngle]
  }

  if (dataCurve != 0) {
    let rx = round(rowWidth / 2, 10)
    let ry = round(dataCurve, 10)

    // 곡선 괘적을 배열로 받아와서
    let arrArcCoordinates = getArrArcCoordinates(rx, ry, startAngle, endAngle)

    let lastIndex = arrArcCoordinates.length - 1

    let coordiGap = arrArcCoordinates[lastIndex][2] / (_items.length - 1)

    let i = 1

    // 곡선 괘적이 2개 이상이면 item 괘적의 위치를 계산하여 item 을 위치시고
    if (lastIndex > 0) {
      _items[0]
        .querySelector('.seat-rect')
        .setAttribute('x', arrArcCoordinates[0][0])
      _items[0]
        .querySelector('.seat-rect')
        .setAttribute('y', arrArcCoordinates[0][1])

      _items[0]
        .querySelector('.seat-text')
        .setAttribute('x', arrArcCoordinates[0][0] + 10)
      _items[0]
        .querySelector('.seat-text')
        .setAttribute('y', arrArcCoordinates[0][1] + 10)

      for (let idx = 1; idx < _items.length - 1; idx++) {
        let idxGap = idx * coordiGap
        for (; i < lastIndex; i++) {
          if (idxGap <= arrArcCoordinates[i][2]) {
            _items[idx]
              .querySelector('.seat-rect')
              .setAttribute('x', arrArcCoordinates[i][0])
            _items[idx]
              .querySelector('.seat-rect')
              .setAttribute('y', arrArcCoordinates[i][1])

            _items[idx]
              .querySelector('.seat-text')
              .setAttribute('x', arrArcCoordinates[i][0] + 10)
            _items[idx]
              .querySelector('.seat-text')
              .setAttribute('y', arrArcCoordinates[i][1] + 10)

            break
          }
        }
      }

      _items[_items.length - 1]
        .querySelector('.seat-rect')
        .setAttribute('x', arrArcCoordinates[lastIndex][0])
      _items[_items.length - 1]
        .querySelector('.seat-rect')
        .setAttribute('y', arrArcCoordinates[lastIndex][1])

      _items[_items.length - 1]
        .querySelector('.seat-text')
        .setAttribute('x', arrArcCoordinates[lastIndex][0] + 10)
      _items[_items.length - 1]
        .querySelector('.seat-text')
        .setAttribute('y', arrArcCoordinates[lastIndex][1] + 10)
    } else {
      // 곡선 괘적이 1개 인 경우. 즉, startAngle === endAngle 인 경우 모두 같은 지점으로 설정
      for (let idx = 0; idx < _items.length; idx++) {
        _items[idx]
          .querySelector('.seat-rect')
          .setAttribute('x', arrArcCoordinates[0][0])
        _items[idx]
          .querySelector('.seat-rect')
          .setAttribute('y', arrArcCoordinates[0][1])

        _items[idx]
          .querySelector('.seat-text')
          .setAttribute('x', arrArcCoordinates[0][0] + 10)
        _items[idx]
          .querySelector('.seat-text')
          .setAttribute('y', arrArcCoordinates[0][1] + 10)
      }
    }

    let _labels = row.querySelector('.label-item')
    let labelIndex = Math.floor((endAngle - startAngle) / 2)

    _labels
      .querySelector('.label-rect')
      .setAttribute('y', arrArcCoordinates[labelIndex][1])
    _labels
      .querySelector('.label-text')
      .setAttribute('y', arrArcCoordinates[labelIndex][1])

    if (flipHor === 'X') {
      $.lts.cvs.select.setRotationDegree($(row), angle * -1)
    } else if (flipVer === 'Y') {
      $.lts.cvs.select.setRotationDegree($(row), angle * -1 + 180)
    }
  } else {
    for (let idx = 0; idx < _items.length; idx++) {
      $(_items[idx]).find('.seat-rect').attr('y', 0)
      $(_items[idx]).find('.seat-text').attr('y', 10)
    }
    let _labels = row.querySelector('.label-item')
    _labels.querySelector('.label-rect').setAttribute('y', 0)
    _labels.querySelector('.label-text').setAttribute('y', 0)
  }
  // 변경된 위치 정보 계산하기
  let _coorX = [],
    _coorY = []
  for (let idx = 0; idx < _items.length; idx++) {
    let itemLeft =
      round(_items[idx].getBoundingClientRect().left, 10) +
      round($canvasScreen.scrollLeft(), 10) -
      $.lts.opts.canvas.seat.offsetX

    if (!_coorX[0] || _coorX[0] > itemLeft) {
      _coorX[0] = itemLeft
    }

    if (
      !_coorX[1] ||
      _coorX[1] < itemLeft + _items[idx].getBoundingClientRect().width
    ) {
      _coorX[1] = itemLeft + _items[idx].getBoundingClientRect().width
    }

    let itemTop =
      round(_items[idx].getBoundingClientRect().top, 10) +
      round($canvasScreen.scrollTop(), 10) -
      $.lts.opts.canvas.seat.offsetY

    if (!_coorY[0] || _coorY[0] > itemTop) {
      _coorY[0] = itemTop
    }

    if (
      !_coorY[1] ||
      _coorY[1] < itemTop + _items[idx].getBoundingClientRect().height
    ) {
      _coorY[1] = itemTop + _items[idx].getBoundingClientRect().height
    }
  }

  let dataPosX0 = _coorX[0] / $.lts.opts.canvas.screen.zoom
  let dataPosX1 = _coorX[1] / $.lts.opts.canvas.screen.zoom
  let dataPosY0 = _coorY[0] / $.lts.opts.canvas.screen.zoom
  let dataPosY1 = _coorY[1] / $.lts.opts.canvas.screen.zoom

  if (flipHor !== 'X' && flipVer !== 'Y') {
    var posLeft =
      row.getBoundingClientRect().left +
      $canvasScreen.scrollLeft() -
      $.lts.opts.canvas.seat.offsetX
    var posTop =
      row.getBoundingClientRect().top +
      $canvasScreen.scrollTop() -
      $.lts.opts.canvas.seat.offsetY

    posLeft /= $.lts.opts.canvas.screen.zoom
    posTop /= $.lts.opts.canvas.screen.zoom

    row.setAttribute('data-pos-left', posLeft)
    row.setAttribute('data-pos-top', posTop)
  }

  // 변경된 후의 형상이 캔버스를 넘어간 경우 이전 형상으로 복원한다
  let margin = 8
  if (
    dataPosX0 < margin ||
    dataPosX1 > $canvasFrame.width() - margin ||
    dataPosY0 < margin ||
    dataPosY1 > $canvasFrame.height() - margin
  ) {
    row.innerHTML = org_children
    return false
  }

  let radian = $.lts.cvs.select.getRotationRadian($(row))
  // row.setAttribute('data-angle-rad', radian);

  row.setAttribute('data-curve', dataCurve)
  row.setAttribute('data-curve-angle-start', startAngle)
  row.setAttribute('data-curve-angle-end', endAngle)
  row.setAttribute('data-gap-hor', gap)

  // Make coordination adjusted
  row.setAttribute('data-pos-x', '[' + dataPosX0 + ',' + dataPosX1 + ']')
  row.setAttribute('data-pos-y', '[' + dataPosY0 + ',' + dataPosY1 + ']')
}

const getArrArcCoordinates = (rx, ry, startAngle, endAngle) => {
  let arrArcCoordinates = []
  let lastCoordinate = null

  let precision = 10

  // Angle 시작점이 (x, 0) 이 (0, x) 지점으로 가정하기 때문에 90 도 더해야 한다. 즉, 시계방향으로 회전 하는 시작점을 90도 뒤로 변경한다.
  startAngle = (parseInt(startAngle) + 90) * precision
  endAngle = (parseInt(endAngle) + 90) * precision

  for (let i = startAngle; i <= endAngle; i++) {
    let t = Math.tan((i / precision / 360) * Math.PI)
    let px = (rx * (1 - t ** 2)) / (1 + t ** 2) + rx,
      py = (ry * 2 * t) / (1 + t ** 2)
    let distance = 0

    px = round(px, 10)
    py = round(py, 10)

    if (lastCoordinate !== null) {
      distance =
        lastCoordinate[2] +
        Math.sqrt((lastCoordinate[0] - px) ** 2 + (lastCoordinate[1] - py) ** 2)
      distance = round(distance, 10)
    }
    lastCoordinate = [px, py, distance]
    arrArcCoordinates.push(lastCoordinate)
  }

  return arrArcCoordinates
}

const LabelFormats = {
  AlphaSerial: 1, //  A,B,...AA,BB,...AAA,BBB...
  NumSerial1: 2, // 1,2,3,...
  NumSerial2: 3, // 1,3,5,...
  NumSerial3: 4, // 2,4,6,...
  NumSerial4: 5, // 1,3,5,...6,4,2
  NumSerial5: 6, // ...5,3,1,2,4,6...
  Custom: 10, //
}

const LabelFormatMode = [
  { label: 'A,B,..', val: LabelFormats.AlphaSerial },
  { label: '1,2,3..', val: LabelFormats.NumSerial1 },
  { label: '1,3,5..', val: LabelFormats.NumSerial2 },
  { label: '2,4,6..', val: LabelFormats.NumSerial3 },
  { label: '1,3,5..6,4,2', val: LabelFormats.NumSerial4 },
  { label: '..5,3,1,2,4,6..', val: LabelFormats.NumSerial5 },
  { label: 'Custom', val: LabelFormats.Custom },
]

// Helper function to convert number to alphabetic sequence (A, B, C, ... Z, AA, AB, ...)
const getAlphaLabel = (num) => {
  let label = ''

  // Convert to base-26 (A-Z)
  do {
    // Adjust for 0-indexed to 1-indexed (A=1, B=2, ...)
    num--
    // Get the remainder when divided by 26 (0-25, corresponding to A-Z)
    const charCode = (num % 26) + 65 // 65 is ASCII for 'A'
    // Add the character to the beginning of our label
    label = String.fromCharCode(charCode) + label
    // Integer division to get the quotient for the next iteration
    num = Math.floor(num / 26)
  } while (num > 0)

  return label
}

/**
 * Formats labels according to specified type
 * @param {Object} options - Configuration options
 * @param {string} options.prefix - Text to prepend to each label
 * @param {string} options.postfix - Text to append to each label
 * @param {number} options.type - Label format type from LabelFormats
 * @param {number} options.start - Starting value for the sequence
 * @param {number} options.maxlen - Number of labels to generate
 * @param {Array} [options.customLabels] - Custom labels array when type is Custom
 * @returns {Array} Array of objects with idx and label properties
 */
const formatLabel = ({
  prefix = '',
  postfix = '',
  type,
  start = 0,
  maxlen = 10,
  custom = 'custom',
}) => {
  const buf = []

  // Handle custom labels separately
  if (type === LabelFormats.Custom) {
    for (let i = 0; i < maxlen; i++) {
      buf.push({
        idx: i,
        label: prefix + custom + postfix,
      })
    }
    return buf
  }

  // Handle other label formats
  for (let i = 0; i < maxlen; i++) {
    let label = ''

    switch (type) {
      case LabelFormats.AlphaSerial:
        // Convert to alphabetic sequence (A, B, C, ... Z, AA, AB, ...)
        label = getAlphaLabel(start + i + 1) // +1 to start from A (not @)
        break

      case LabelFormats.NumSerial1:
        // Simple sequential numbers: 1, 2, 3, ...
        label = String(start + i + 1)
        break

      case LabelFormats.NumSerial2:
        // Odd numbers: 1, 3, 5, ...
        label = String(start + i * 2 + 1)
        break

      case LabelFormats.NumSerial3:
        // Even numbers: 2, 4, 6, ...
        label = String(start + i * 2 + 2)
        break

      // case LabelFormats.NumSerial4:
      //   // Ascending odd then descending even: 1, 3, 5, ..., 6, 4, 2
      //   const halfLen = Math.ceil(maxlen / 2)
      //   if (i < halfLen) {
      //     // First half: ascending odd numbers
      //     label = String(start + i * 2 + 1)
      //   } else {
      //     // Second half: descending even numbers
      //     const reverseIndex = maxlen - (i - halfLen) - 1
      //     label = String(start + reverseIndex * 2 + 2)
      //   }
      //   break
      // case LabelFormats.NumSerial4:
      //   // Ascending odd then descending even: 1, 3, 5, ..., 10, 8, 6, 4, 2
      //   const halfLen = Math.ceil(maxlen / 2)
      //   if (i < halfLen) {
      //     // First half: ascending odd numbers
      //     label = String(start + i * 2 + 1)
      //   } else {
      //     // Second half: descending even numbers
      //     // Calculate how many positions from the end we are
      //     const posFromEnd = i - halfLen
      //     // Start from the highest even number and go down
      //     label = String(start + (halfLen - posFromEnd) * 2)
      //   }
      //   break

      // case LabelFormats.NumSerial5:
      //   // Descending odd then ascending even: ..., 5, 3, 1, 2, 4, 6, ...
      //   const halfLength = Math.ceil(maxlen / 2)
      //   if (i < halfLength) {
      //     // First half: descending odd numbers
      //     const reverseIndex = halfLength - i - 1
      //     label = String(start + reverseIndex * 2 + 1)
      //   } else {
      //     // Second half: ascending even numbers
      //     label = String(start + (i - halfLength) * 2 + 2)
      //   }
      //   break
      case LabelFormats.NumSerial4:
        // Ascending odd then descending even: 1, 3, 5, ..., 10, 8, 6, 4, 2
        const halfLen = Math.ceil(maxlen / 2)
        if (i < halfLen) {
          // First half: ascending odd numbers
          label = String(start + i * 2 + 1)
        } else {
          // Second half: descending even numbers
          // Calculate how many positions from the end we are
          const posFromEnd = i - halfLen + 1
          // Start from the highest even number and go down
          label = String(
            start + (halfLen - posFromEnd + (maxlen % 2 === 0 ? 1 : 0)) * 2
          )
        }
        break

      case LabelFormats.NumSerial5:
        // Descending odd then ascending even: 9, 7, 5, 3, 1, 2, 4, 6, 8, 10
        const halfLength = Math.ceil(maxlen / 2)
        if (i < halfLength) {
          // First half: descending odd numbers - starting from the highest odd number
          // const reverseIndex = halfLength - i - 1
          const reverseIndex = i
          label = String(start + halfLength * 2 - reverseIndex * 2 - 1)
        } else {
          // Second half: ascending even numbers
          label = String(start + (i - halfLength + 1) * 2)
        }
        break

      default:
        label = String(i)
    }

    buf.push({
      idx: i,
      label: prefix + label + postfix,
    })
  }

  return buf
}

// Object.keys(LabelFormats).map((k) => {
//   console.log(
//     'case',
//     k,
//     formatLabel({ type: LabelFormats[k], maxlen: 6 })
//       .map((i) => i.label)
//       .join(', ')
//   )
// })
// Object.keys(LabelFormats).map((k) => {
//   console.log(
//     'case',
//     k,
//     formatLabel({ type: LabelFormats[k], maxlen: 7 })
//       .map((i) => i.label)
//       .join(', ')
//   )
// })
const degreeToRadian = (degree) => (degree * Math.PI) / 180
const radianTodegree = (rad) => (rad * 180) / Math.PI
const refineValue = (v) => {
  return Math.abs(v) < 1e-10 ? 0 : v
}

// const generateArcCoordinates = (
//   x,
//   y,
//   gap,
//   radiusX,
//   radiusY,
//   startAngle,
//   endAngle,
//   n
// ) => {
//   if (n === 1) {
//     const angle = startAngle - 90
//     const xCoord = x + radiusX * Math.cos(angle)
//     const yCoord = y + radiusY * Math.sin(angle)
//     return [{ x: xCoord, y: yCoord }] // n이 1이면 타원 위의 시작점 반환
//   }
//   const dir = radiusY >= 0 ? 1 : -1
//   const coordinates = []
//   const isPlane =
//     refineValue(
//       Math.cos(degreeToRadian(startAngle - 90)) +
//         Math.cos(degreeToRadian(endAngle - 90))
//     ) === 0 && radiusY === 0
//   const angleStep = (endAngle - startAngle) / (n - 1)
//   const width = radiusX + (n - 1) * gap
//   const xstep = width / (n - 1)
//   const height = Math.abs(radiusY)
//   const left = x + ((n - 1) * gap) / 2 - width / 2

//   for (let i = 0; i < n; i++) {
//     const angle = startAngle - 90 + i * angleStep
//     // console.log('angle', angle, isPlane)
//     let xCoord, yCoord
//     if (isPlane) {
//       xCoord = left + i * xstep
//       yCoord = y
//     } else {
//       xCoord = left + i * xstep
//       yCoord = y
//       // xCoord = xCoord - width * refineValue(Math.cos(angle))
//       yCoord =
//         yCoord +
//         height * dir * Math.abs(refineValue(Math.sin(degreeToRadian(angle))))
//       // xCoord = x - width * refineValue(Math.cos(angle))
//       // yCoord = y + radiusY * refineValue(Math.sin(angle))
//     }
//     coordinates.push({ x: xCoord, y: yCoord, angle: angle })
//   }

//   return coordinates
// }
// export const generateArcCoordinates = (
//   centerX,
//   centerY,
//   radiusX,
//   radiusY,
//   startAngle,
//   endAngle,
//   numPoints
// ) => {
//   const coordinates = []

//   // 각도 변환 함수 (사용자 체계 -> 표준 체계)
//   const convertAngle = (userAngle) => {
//     const standardAngle = 270 - userAngle // 각도 체계 변환
//     return (standardAngle + 360) % 360 // 0~360도 정규화
//   }

//   // 각도 증분 계산
//   const angleStep = (endAngle - startAngle) / (numPoints - 1)

//   for (let i = 0; i < numPoints; i++) {
//     const currentUserAngle = startAngle + i * angleStep
//     const radians = degreeToRadian(convertAngle(currentUserAngle))

//     // 좌표 계산 (타원 방정식 적용)
//     const x = centerX + radiusX * Math.cos(radians)
//     const y = centerY + radiusY * Math.sin(radians)

//     coordinates.push({
//       x: Number(x.toFixed(2)),
//       y: Number(y.toFixed(2)),
//       angle: currentUserAngle % 360,
//     })
//   }

//   return coordinates
// }
// export const generateArcCoordinates = (
//   centerX,
//   centerY,
//   gap,
//   seatSize,
//   radiusY,
//   startAngle,
//   endAngle,
//   numPoints
// ) => {
//   const coordinates = []

//   // 각도 변환 함수 (사용자 체계 -> 표준 체계)
//   const convertAngle = (userAngle) => {
//     const standardAngle = 270 - userAngle // 각도 체계 변환
//     return (standardAngle + 360) % 360 // 0~360도 정규화
//   }

//   const radiusX = (seatSize + gap) * numPoints - gap // X축 반지름 계산

//   if (radiusY === 0) {
//     for (let i = 0; i < numPoints; i++) {
//       coordinates.push({
//         x: centerX + i * (seatSize + gap),
//         y: centerY,
//         angle:
//           (startAngle + i * ((endAngle - startAngle) / (numPoints - 1))) % 360,
//       })
//     }
//   } else {
//     // 각도 증분 계산
//     const angleStep = (endAngle - startAngle) / (numPoints - 1)

//     for (let i = 0; i < numPoints; i++) {
//       const currentUserAngle = startAngle + i * angleStep
//       const radians = degreeToRadian(convertAngle(currentUserAngle))

//       // 좌표 계산 (타원 방정식 적용)
//       const x = centerX + radiusX * Math.cos(radians)
//       const y = centerY + radiusY * Math.sin(radians)

//       coordinates.push({
//         x: Number(x.toFixed(2)),
//         y: Number(y.toFixed(2)),
//         angle: currentUserAngle % 360,
//       })
//     }
//   }

//   return coordinates
// }

// /**
//  * x좌표가 균등하게 떨어진 점들을 먼저 계산한 후 타원 위로 매핑하는 함수
//  * 각도는 -x축이 90도, +x축이 270도인 좌표계 사용
//  *
//  * @param {number} x - 타원의 중심 x 좌표
//  * @param {number} y - 타원의 중심 y 좌표
//  * @param {number} gap - x 좌표 간 간격 (gap > 0 인 경우에만 사용)
//  * @param {number} radiusX - 타원의 x 반지름
//  * @param {number} radiusY - 타원의 y 반지름
//  * @param {number} startAngle - 시작 각도 (도)
//  * @param {number} endAngle - 종료 각도 (도)
//  * @param {number} n - 생성할 점의 개수 (gap이 지정되면 무시됨)
//  * @returns {Array} - 좌표 배열 [{x, y}]
//  */
// // function generateArcCoordinates(
// //   x,
// //   y,
// //   gap,
// //   radiusX,
// //   radiusY,
// //   startAngle,
// //   endAngle,
// //   n
// // ) {
// //   // 각도를 라디안으로 변환 (이 함수에서는 -x축이 90도, +x축이 270도)
// //   const adjustAngle = (angle) => {
// //     // 표준 각도 변환 (90도는 -x축, 270도는 +x축)
// //     return (450 - angle) % 360
// //   }

// //   const startRadStandard = (adjustAngle(startAngle) * Math.PI) / 180
// //   const endRadStandard = (adjustAngle(endAngle) * Math.PI) / 180

// //   // 시작과 끝 지점의 x 좌표 계산
// //   const startX = x + radiusX * Math.cos(startRadStandard)
// //   const endX = x + radiusX * Math.cos(endRadStandard)

// //   let coords = []

// //   // 점 개수 결정
// //   if (gap && gap > 0) {
// //     // x 간격이 지정된 경우 필요한 점의 수 계산
// //     n = Math.max(2, Math.ceil(Math.abs(endX - startX) / gap) + 1)
// //   }

// //   // 최소 2개의 점을 보장
// //   n = Math.max(2, n)

// //   // x 좌표 간격 계산
// //   const xStep = (endX - startX) / (n - 1)

// //   // 각 x 좌표에 대응하는 타원 위의 점 계산
// //   for (let i = 0; i < n; i++) {
// //     const currentX = startX + i * xStep

// //     // x 좌표로부터 가능한 y 좌표를 계산 (타원 방정식 사용)
// //     // (x-h)²/a² + (y-k)²/b² = 1 => y = k ± b*sqrt(1 - (x-h)²/a²)
// //     // 여기서 (h,k)는 중심점 (x,y)

// //     // 현재 x가 타원의 x 범위 내인지 확인
// //     if (Math.abs(currentX - x) > radiusX) {
// //       continue // 타원 범위를 벗어나면 건너뜀
// //     }

// //     // y 좌표 계산 (타원 방정식 사용)
// //     const term = 1 - Math.pow((currentX - x) / radiusX, 2)

// //     // 타원의 상반부, 하반부 중 어느 쪽인지 결정
// //     // 시작 각도와 종료 각도 사이에서 우리가 원하는 부분을 선택
// //     // 이를 위해 현재 점의 각도를 계산

// //     // 점의 각도 계산 (중심점 기준)
// //     const dx = currentX - x
// //     let currentAngleStandard = 0

// //     if (dx === 0) {
// //       // x가 중심과 같은 경우
// //       currentAngleStandard = Math.PI / 2 // 90도, y축 방향
// //     } else {
// //       // 타원 위의 점 각도 계산 (표준 좌표계)
// //       currentAngleStandard = Math.acos(dx / radiusX)
// //     }

// //     // 표준 각도를 우리의 좌표계로 변환 (역변환)
// //     let currentAngle = (450 - (currentAngleStandard * 180) / Math.PI) % 360

// //     // 각도가 시작과 종료 사이에 있는지 확인
// //     // 시작과 종료 각도 사이를 지나는 경우 처리
// //     let isInRange = false

// //     if (startAngle <= endAngle) {
// //       isInRange = currentAngle >= startAngle && currentAngle <= endAngle
// //     } else {
// //       isInRange = currentAngle >= startAngle || currentAngle <= endAngle
// //     }

// //     if (!isInRange) {
// //       // 시작과 종료 각도 사이에 없으면 반대편 y값 사용
// //       currentAngleStandard = 2 * Math.PI - currentAngleStandard
// //       currentAngle = (450 - (currentAngleStandard * 180) / Math.PI) % 360

// //       // 다시 범위 확인
// //       if (startAngle <= endAngle) {
// //         isInRange = currentAngle >= startAngle && currentAngle <= endAngle
// //       } else {
// //         isInRange = currentAngle >= startAngle || currentAngle <= endAngle
// //       }

// //       if (!isInRange) {
// //         continue // 범위 밖이면 건너뜀
// //       }
// //     }

// //     // y 좌표 계산 (타원 방정식 사용)
// //     const pointY = y + radiusY * refineValue(Math.sin(currentAngleStandard))

// //     coords.push({ x: currentX, y: pointY })
// //   }

// //   return coords
// // }
export const generateArcCoordinates = (
  leftX, // 왼쪽 끝 X 좌표
  leftY, // 왼쪽 끝 Y 좌표
  gap,
  seatSize,
  radiusY,
  startAngle,
  endAngle,
  numPoints
) => {
  const coordinates = []

  // 직선 모드 (radiusY === 0)
  if (radiusY === 0) {
    for (let i = 0; i < numPoints; i++) {
      coordinates.push({
        x: leftX + i * (seatSize + gap),
        y: leftY,
        angle:
          (startAngle + i * ((endAngle - startAngle) / (numPoints - 1))) % 360,
      })
    }
    return coordinates
  }

  // 원호 모드 (radiusY !== 0)
  const totalWidth = (seatSize + gap) * (numPoints - 1)
  const radiusX = totalWidth / 2
  const arcCenterX = leftX + radiusX // 원호의 중심 X 좌표

  const angleStep = (endAngle - startAngle) / (numPoints - 1)

  for (let i = 0; i < numPoints; i++) {
    const currentUserAngle = startAngle + i * angleStep
    const radians = degreeToRadian(270 - currentUserAngle)

    // 좌표 계산
    const x = arcCenterX + radiusX * Math.cos(radians)
    const y = leftY + radiusY * Math.sin(radians)

    coordinates.push({
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      angle: currentUserAngle % 360,
    })
  }

  return coordinates
}

// const buf = generateArcCoordinates(-20, 0, 0, 5, 10, 0, 270, 9)

// console.log(buf)

const convPixel = (pixelString) => {
  // "130px" 형태의 문자열에서 숫자 부분만 추출
  const match = pixelString.match(/^([-,+]?\d+(?:\.\d+)?)px$/)
  if (!match) {
    throw new Error(
      `${pixelString}: Invalid pixel format. Expected format: "123px" or "123.5px"`
    )
  }
  return parseFloat(match[1])
}

// console.log(convPixel('-2201px'))

const snapPos = (start, x, gridSize) => {
  return Math.round(x / gridSize) * gridSize
}

for (let i = 0; i < 1000; i++) console.log(i / 100, snapPos(0, i / 100, 5))
