import { onMount, onCleanup } from 'solid-js'
import { select, scaleLinear, scalePoint, area, line, curveCatmullRom } from 'd3'
import type { HourlyForecast, Period } from './lib/nws.ts'

export default function HourlyTempsChart({ hourlyForecast }: { hourlyForecast: HourlyForecast }) {
    let containerRef: HTMLDivElement | undefined

    onMount(() => {
        if (!containerRef || !hourlyForecast?.periods?.length) return

        const periods = hourlyForecast.periods
        const minTemp = Math.min(...periods.map((p) => p.temperature))
        const maxTemp = Math.max(...periods.map((p) => p.temperature))

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

        // X scale for temperature (horizontal)
        const xScale = scaleLinear()
            .domain([minTemp - 5, maxTemp + 5])
            .range([0, width + margin.left + margin.right - 6])

        // Y scale for time periods (vertical)
        const yScale = scalePoint<number>()
            .domain(periods.map((_, i) => i))
            .range([0, height])
            .padding(0.5)

        // Create the area generator for vertical orientation
        const areaGenerator = area<Period>()
            .x0(xScale(minTemp - 5))
            .x1((d) => xScale(d.temperature))
            .y((_, i) => yScale(i) ?? 0)
            .curve(curveCatmullRom.alpha(0.5))

        // Temperature to color scale (purple for cold, red for hot) using absolute temperatures
        const tempColorScale = scaleLinear<string>()
            .domain([32, 65, 95])
            .range(['rgba(168, 85, 247, 0.6)', 'rgba(59, 130, 246, 0.6)', 'rgba(239, 68, 68, 0.6)'])
            .clamp(true)

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

        // Create vertical gradient based on temperature at each point
        const gradient = defs
            .append('linearGradient')
            .attr('id', 'temp-gradient')
            .attr('x1', '0%')
            .attr('x2', '0%')
            .attr('y1', '0%')
            .attr('y2', '100%')

        // Add gradient stops for each data point based on its temperature
        periods.forEach((period, i) => {
            const offset = (i / (periods.length - 1)) * 100
            gradient.append('stop').attr('offset', `${offset}%`).attr('stop-color', tempColorScale(period.temperature))
        })

        // Draw the area
        svg.append('path').datum(periods).attr('fill', 'url(#temp-gradient)').attr('d', areaGenerator)

        // Draw the line on top of the area
        const lineGenerator = line<Period>()
            .x((d) => xScale(d.temperature))
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
                .attr('stop-color', tempColorScale(period.temperature).replace('0.6)', '1)'))
        })

        svg.append('path')
            .datum(periods)
            .attr('fill', 'none')
            .attr('stroke', 'url(#line-gradient)')
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

        // Add short forecast description (only when different from previous hour)
        const forecastLabels = periods
            .map((d, i) => ({ ...d, index: i }))
            .filter((d, i) => i === 0 || d.shortForecast !== periods[i - 1].shortForecast)

        svg.selectAll('.forecast-label')
            .data(forecastLabels)
            .enter()
            .append('text')
            .attr('class', 'forecast-label')
            .attr('x', 4)
            .attr('y', (d) => yScale(d.index) ?? 0)
            .attr('dy', '1.2em')
            .attr('text-anchor', 'start')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .attr('fill', 'black')
            .attr('filter', 'url(#text-shadow)')
            .text((d) => d.shortForecast)

        // Add temperature labels on the right (colored by temperature)
        svg.selectAll('.temp-label')
            .data(periods)
            .enter()
            .append('text')
            .attr('class', 'temp-label')
            .attr('x', (d) => xScale(d.temperature) + 12)
            .attr('y', (_, i) => yScale(i) ?? 0)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'start')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .attr('fill', (d) => tempColorScale(d.temperature).replace('0.6)', '1)'))
            .text((d) => `${d.temperature}°`)

        // Add axis lines connecting time labels to temperature circles
        svg.selectAll('.axis-line')
            .data(periods)
            .enter()
            .append('line')
            .attr('class', 'axis-line')
            .attr('x1', 0)
            .attr('y1', (_, i) => yScale(i) ?? 0)
            .attr('x2', (d) => xScale(d.temperature))
            .attr('y2', (_, i) => yScale(i) ?? 0)
            .attr('stroke', 'var(--bs-border-color)')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '2,2')

        // Add dots at data points with temperature-based colors
        svg.selectAll('.data-point')
            .data(periods)
            .enter()
            .append('circle')
            .attr('class', 'data-point')
            .attr('cx', (d) => xScale(d.temperature))
            .attr('cy', (_, i) => yScale(i) ?? 0)
            .attr('r', 5)
            .attr('fill', (d) => tempColorScale(d.temperature).replace('0.6)', '1)'))
            .attr('stroke', 'white')
            .attr('stroke-width', 2)

        onCleanup(() => {
            select(containerRef).selectAll('*').remove()
        })
    })

    return (
        <div class={'card rounded-4 mb-2'}>
            <div class={'card-header'}>HOURLY TEMPERATURE</div>
            <div class={'card-body bg-body rounded-bottom-4'}>
                <div ref={containerRef} class='hourly-temps-chart'></div>
            </div>
        </div>
    )
}
