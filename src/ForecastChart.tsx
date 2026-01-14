import { onCleanup, onMount } from 'solid-js'
import { area, curveCatmullRom, line, scaleLinear, scalePoint, select } from 'd3'

import type { Period } from './lib/nws.ts'

export interface ForecastChartProps {
    title: string
    classList?: string[]
    colorDomain: number[]
    colorRange: string[]
    periods: Period[]
    getX: (p: Period) => number
    getXLabel: (p: Period) => string
    getY?: (p: Period) => number
    getForecastLabel: (p: Period) => string
}

export default function ForecastChart({
    title,
    classList,
    colorDomain,
    colorRange,
    periods,
    getX,
    getXLabel,
    getForecastLabel
}: ForecastChartProps) {
    let containerRef!: HTMLDivElement

    onMount(() => {
        if (!containerRef || !periods) {
            return
        }

        const { paddingRight } = getComputedStyle(containerRef)
        const margin = { top: 20, left: 50, right: parseInt(paddingRight), bottom: 20 }
        const width = containerRef.clientWidth - margin.left - margin.right
        const height = periods.length * 40

        const xMin = Math.min(...periods.map((p) => getX(p)))
        const xMax = Math.max(...periods.map((p) => getX(p)))
        const relativeMinX = xMin - (xMax - xMin)
        const dataPointCircleRadius = 5
        const timeLabelPadding = 10
        const dataPointLabelPadding = dataPointCircleRadius * 2

        // data-value to color scale
        const tempColorScale = scaleLinear<string>().domain(colorDomain).range(colorRange).clamp(true)

        const svg = select(containerRef)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height)
            .append('g')

        // Y scale for time periods (vertical)
        const yScale = scalePoint<number>()
            .domain(periods.map((_, i) => i))
            .range([0, height])
            .padding(0.5)

        // Add time labels on the left
        const timeLabels = svg
            .selectAll('.time-label')
            .data(periods)
            .enter()
            .append('text')
            .attr('class', 'time-label')
            .attr('x', -timeLabelPadding)
            .attr('y', (_, i) => yScale(i) ?? 0)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'end')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .attr('fill', (_, i) => (i === 0 ? 'rgba(59, 130, 246, 1)' : 'var(--bs-body-color)'))
            .text((d, i) => (i === 0 ? 'NOW' : d.hourString))

        // Get width of the widest time label
        const timeLabelWidths = timeLabels.nodes().map((n) => n.scrollWidth)
        const maxTimeLabelWidth = Math.max(...timeLabelWidths)

        // Use the maxTimeLabelWidth to determine how much the chart area needs to shift right
        svg.attr('transform', `translate(${maxTimeLabelWidth + timeLabelPadding},0)`)

        // Add data point labels on the right (colored by data point)
        const dataPointLabels = svg
            .selectAll('.x-label')
            .data(periods)
            .enter()
            .append('text')
            .attr('class', 'x-label')
            .attr('dy', '0.35em')
            .attr('text-anchor', 'start')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .attr('fill', (d) => tempColorScale(getX(d)).replace('0.6)', '1)'))
            .text((d) => `${getXLabel(d)}`)

        const dataPoinLabelWidths = dataPointLabels.nodes().map((n) => n.scrollWidth)
        const maxDataPointLabelWidth = Math.max(...dataPoinLabelWidths)

        // X scale for data point (horizontal)
        const xScale = scaleLinear()
            .domain([relativeMinX, xMax])
            .range([
                0,
                width +
                    margin.left +
                    margin.right -
                    maxTimeLabelWidth -
                    timeLabelPadding -
                    dataPointLabelPadding -
                    maxDataPointLabelWidth
            ])

        svg.selectAll('text.x-label')
            .data(periods)
            .attr('x', (d) => xScale(getX(d)) + dataPointLabelPadding)
            .attr('y', (_, i) => yScale(i) ?? 0)

        // Create the area generator for vertical orientation
        const areaGenerator = area<Period>()
            .x0(xScale(relativeMinX))
            .x1((d) => xScale(getX(d)))
            .y((_, i) => yScale(i) ?? 0)
            .curve(curveCatmullRom.alpha(0.5))

        // Create defs for gradients and filters
        const defs = svg.append('defs')

        // Add drop shadow filter for text
        const filter = defs
            .append('filter')
            .attr('id', 'text-shadow')
            .attr('x', '-20%')
            .attr('y', '-20%')
            .attr('width', '140%')
            .attr('height', '140%')

        filter
            .append('feDropShadow')
            .attr('dx', '0')
            .attr('dy', '0')
            .attr('stdDeviation', '2')
            .attr('flood-color', 'white')
            .attr('flood-opacity', '0.8')

        // Create vertical gradient based on data point at each point
        const gradient = defs
            .append('linearGradient')
            .attr('id', 'temp-gradient')
            .attr('x1', '0%')
            .attr('x2', '0%')
            .attr('y1', '0%')
            .attr('y2', '100%')

        // Add gradient stops for each data point based on its data point
        periods.forEach((period, i) => {
            const offset = (i / (periods.length - 1)) * 100
            gradient
                .append('stop')
                .attr('offset', `${offset}%`)
                .attr('stop-color', tempColorScale(getX(period)))
        })

        // Draw the area
        svg.append('path').datum(periods).attr('fill', 'url(#temp-gradient)').attr('d', areaGenerator)

        const lineGenerator = line<Period>()
            .x((d) => xScale(getX(d)))
            .y((_, i) => yScale(i) ?? 0)
            .curve(curveCatmullRom.alpha(0.5))

        // Create gradient for the line stroke
        const lineGradient = defs
            .append('linearGradient')
            .attr('id', 'line-gradient')
            .attr('x1', '0%')
            .attr('x2', '0%')
            .attr('y1', '0%')
            .attr('y2', '100%')

        periods.forEach((period, i) => {
            const offset = (i / (periods.length - 1)) * 100
            lineGradient
                .append('stop')
                .attr('offset', `${offset}%`)
                .attr('stop-color', tempColorScale(getX(period)).replace('0.6)', '1)'))
        })

        svg.append('path')
            .datum(periods)
            .attr('fill', 'none')
            .attr('stroke', 'url(#line-gradient)')
            .attr('stroke-width', 2)
            .attr('d', lineGenerator)

        // Add short forecast description (only when different from previous hour)
        const forecastLabels = periods
            .map((d, i) => ({ ...d, index: i }))
            .filter((d, i) => i === 0 || getForecastLabel(d) !== getForecastLabel(periods[i - 1]))

        const forecastLabelGroup = svg
            .selectAll('.forecast-label')
            .data(forecastLabels)
            .enter()
            .append('g')
            .attr('class', 'forecast-label')
            .attr('transform', (d) => `translate(0, ${yScale(d.index) ?? 0})`)

        const forecastLabelBg = forecastLabelGroup
            .append('rect')
            .attr('height', 20)
            .attr('width', 40)
            .attr('fill', 'rgba(255, 255, 255, 0.2)')

        const forecastLabelText = forecastLabelGroup
            .append('text')
            .attr('class', 'forecast-label')
            .attr('dx', '0.4em')
            .attr('dy', '1.0em')
            .attr('text-anchor', 'start')
            .attr('font-size', '12px')
            .attr('fill', 'black')
            .text((d) => getForecastLabel(d))

        const forecastLabelWidths = forecastLabelText.nodes().map((el) => [el.scrollHeight, el.scrollWidth])

        forecastLabelBg
            .attr('height', (_, i) => forecastLabelWidths[i][0])
            .attr('width', (_, i) => forecastLabelWidths[i][1] + 10)

        // Add axis lines connecting time labels to data point circles
        svg.selectAll('.axis-line')
            .data(periods)
            .enter()
            .append('line')
            .attr('class', 'axis-line')
            .attr('x1', 0)
            .attr('y1', (_, i) => yScale(i) ?? 0)
            .attr('x2', (d) => xScale(getX(d)))
            .attr('y2', (_, i) => yScale(i) ?? 0)
            .attr('stroke', 'var(--bs-border-color)')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '2,2')

        // Add dots at data points with data point-based colors
        svg.selectAll('.data-point')
            .data(periods)
            .enter()
            .append('circle')
            .attr('class', 'data-point')
            .attr('cx', (d) => xScale(getX(d)))
            .attr('cy', (_, i) => yScale(i) ?? 0)
            .attr('r', 5)
            .attr('fill', (d) => tempColorScale(getX(d)).replace('0.6)', '1)'))
            .attr('stroke', 'white')
            .attr('stroke-width', 2)

        onCleanup(() => {
            select(containerRef).selectAll('*').remove()
        })
    })

    return (
        <div class={'card rounded-4 mb-2'}>
            <div class={'card-header'}>{title}</div>
            <div class={'card-body bg-body-secondary rounded-bottom-4'}>
                <div ref={containerRef} class={`w-100 ${classList?.join(' ')}`}></div>
            </div>
        </div>
    )
}
