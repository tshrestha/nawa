import { onMount, onCleanup } from 'solid-js'
import { select, scaleLinear, scalePoint, area, line, curveCatmullRom } from 'd3'

import type { HourlyForecast, Period } from './lib/nws.ts'
import raindropIcon from './assets/weather-icons-master/production/fill/all/raindrop.svg'

export default function HourlyPrecipChart({ hourlyForecast }: { hourlyForecast: HourlyForecast }) {
    let containerRef: HTMLDivElement | undefined

    onMount(() => {
        if (!containerRef || !hourlyForecast?.periods?.length) return

        const periods = hourlyForecast.periods
        const containerStyle = getComputedStyle(containerRef)
        const { paddingRight } = containerStyle

        const margin = { top: 20, left: 50, right: parseInt(paddingRight), bottom: 20 }
        const width = containerRef.clientWidth - margin.left - margin.right
        const height = periods.length * 40

        const svg = select(containerRef)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left},${0})`)

        // X scale for precipitation probability (0-100%)
        const xScale = scaleLinear()
            .domain([0, 100])
            .range([0, width - margin.left])

        // Y scale for time periods (vertical)
        const yScale = scalePoint<number>()
            .domain(periods.map((_, i) => i))
            .range([0, height])
            .padding(0.5)

        // Create the area generator for vertical orientation
        const areaGenerator = area<Period>()
            .x0(xScale(0))
            .x1((d) => xScale(d.probabilityOfPrecipitation.value ?? 0))
            .y((_, i) => yScale(i) ?? 0)
            .curve(curveCatmullRom.alpha(0.5))

        // Precipitation probability to color scale (lighter blue for low, darker blue for high)
        const precipColorScale = scaleLinear<string>()
            .domain([0, 50, 100])
            .range(['rgba(173, 216, 230, 0.6)', 'rgba(100, 149, 237, 0.6)', 'rgba(30, 64, 175, 0.6)'])
            .clamp(true)

        // Create defs for gradients
        const defs = svg.append('defs')

        // Create vertical gradient based on precipitation probability at each point
        const gradient = defs
            .append('linearGradient')
            .attr('id', 'precip-gradient')
            .attr('x1', '0%')
            .attr('x2', '0%')
            .attr('y1', '0%')
            .attr('y2', '100%')

        // Add gradient stops for each data point based on its precipitation probability
        periods.forEach((period, i) => {
            const offset = (i / (periods.length - 1)) * 100
            gradient
                .append('stop')
                .attr('offset', `${offset}%`)
                .attr('stop-color', precipColorScale(period.probabilityOfPrecipitation.value ?? 0))
        })

        // Draw the area
        svg.append('path').datum(periods).attr('fill', 'url(#precip-gradient)').attr('d', areaGenerator)

        // Draw the line on top of the area
        const lineGenerator = line<Period>()
            .x((d) => xScale(d.probabilityOfPrecipitation.value ?? 0))
            .y((_, i) => yScale(i) ?? 0)
            .curve(curveCatmullRom.alpha(0.5))

        // Create gradient for the line stroke
        const lineGradient = defs
            .append('linearGradient')
            .attr('id', 'precip-line-gradient')
            .attr('x1', '0%')
            .attr('x2', '0%')
            .attr('y1', '0%')
            .attr('y2', '100%')

        periods.forEach((period, i) => {
            const offset = (i / (periods.length - 1)) * 100
            lineGradient
                .append('stop')
                .attr('offset', `${offset}%`)
                .attr(
                    'stop-color',
                    precipColorScale(period.probabilityOfPrecipitation.value ?? 0).replace('0.6)', '1)')
                )
        })

        svg.append('path')
            .datum(periods)
            .attr('fill', 'none')
            .attr('stroke', 'url(#precip-line-gradient)')
            .attr('stroke-width', 2)
            .attr('d', lineGenerator)

        // Add time labels on the left
        svg.selectAll('.time-label')
            .data(periods)
            .enter()
            .append('text')
            .attr('class', 'time-label')
            .attr('x', -10)
            .attr('y', (_, i) => yScale(i) ?? 0)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'end')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .attr('fill', (_, i) => (i === 0 ? 'rgba(59, 130, 246, 1)' : 'var(--bs-body-color)'))
            .text((d, i) => (i === 0 ? 'NOW' : d.hourString))

        // Add precipitation probability labels on the right
        svg.selectAll('.precip-label')
            .data(periods)
            .enter()
            .append('text')
            .attr('class', 'precip-label')
            .attr('x', (d) => xScale(d.probabilityOfPrecipitation.value ?? 0) + 12)
            .attr('y', (_, i) => yScale(i) ?? 0)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'start')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .attr('fill', (d) => precipColorScale(d.probabilityOfPrecipitation.value ?? 0).replace('0.6)', '1)'))
            .text((d) => `${d.probabilityOfPrecipitation.value ?? 0}%`)

        // Add axis lines connecting time labels to data points
        svg.selectAll('.axis-line')
            .data(periods)
            .enter()
            .append('line')
            .attr('class', 'axis-line')
            .attr('x1', 0)
            .attr('y1', (_, i) => yScale(i) ?? 0)
            .attr('x2', (d) => xScale(d.probabilityOfPrecipitation.value ?? 0))
            .attr('y2', (_, i) => yScale(i) ?? 0)
            .attr('stroke', 'var(--bs-border-color)')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '2,2')

        // Add raindrop icons at data points
        const iconSize = 32

        svg.selectAll('.data-point')
            .data(periods)
            .enter()
            .append('image')
            .attr('class', 'data-point')
            .attr('href', raindropIcon)
            .attr('x', (d) => xScale(d.probabilityOfPrecipitation.value ?? 0) - iconSize / 2)
            .attr('y', (_, i) => (yScale(i) ?? 0) - iconSize / 2)
            .attr('width', iconSize)
            .attr('height', iconSize)

        onCleanup(() => {
            select(containerRef).selectAll('*').remove()
        })
    })

    return (
        <div class={'card rounded-4 mb-2'}>
            <div class={'card-header'}>HOURLY PRECIPITATION</div>

            <div class={'card-body bg-body rounded-bottom-4'}>
                <div ref={containerRef} class='hourly-precip-chart'></div>
            </div>
        </div>
    )
}
