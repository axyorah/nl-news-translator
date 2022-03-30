const d3 = window["d3"]; // TODO: this should be imported!!!

export interface Data {
    x: number[] | string[],
    y: number[] | string[]
}

export interface Trace {
    size?: string,
    fill?: string,
    data: Data
}

export interface Margin {
    top: string,
    bottom: string,
    left: string,
    right: string
}

export interface Axes {
    stroke: string,
    'stroke-width': string,
    xlabel: string,
    ylabel: string,
    xrange: number[],
    yrange: number[],
    xticks: number[],
    yticks: number[],
    xticklabels: string[],
    yticklabels: string[],
    xtickangle: number,
    ytickangle: number,
    xtickfontsize: string,
    ytickfontsize: string,
}

export interface BBox {
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    x1_inner?: number,
    x2_inner?: number,
    y1_inner?: number,
    y2_inner?: number
}

export interface FigureConfig {
    backgroundColor: string,
    containerColor: string,
    margin: Margin,
    axes: Axes
}

export class Figure {
    clear: boolean
    svg: HTMLOrSVGImageElement
    chart: any; // TODO: this should be inferred from d3!!!!!!!!!
    config: FigureConfig
    bbox: BBox
    traces: Trace[]

    constructor(svg: HTMLOrSVGImageElement, config: FigureConfig) {
        this.clear = true;
        this.svg = svg; // html element
        this.chart = d3.select(`#${svg.id}`);; // d3 class
        
        // default config
        this.config = {
            backgroundColor: 'white',
            containerColor: '#eeeef7',
            margin: {
                top: '5%', 
                bottom: '5%', 
                left: '5%', 
                right: '5%'
            } as Margin,
            axes: {
                stroke: 'grey',
                'stroke-width': '1',
                xlabel: '',
                ylabel: '',
                xrange: [],
                yrange: [],
                xticks: [],
                yticks: [],
                xticklabels: [],
                yticklabels: [],
                xtickangle: 0,
                ytickangle: 0,
                xtickfontsize: '14px',
                ytickfontsize: '14px',
            } as Axes
        }
        // update config
        this.updateConfig(config);

        this.bbox = this.getFigureBbox() as BBox;
        this.traces = [];
    }

    updateConfig = function(configNew: FigureConfig): void {
        for (let key in this.config) {
            if (key in configNew) {
                if (typeof(this.config[key]) === 'object') {
                    for (let k in this.config[key]) {
                        if (k in configNew[key]) {
                            this.config[key][k] = configNew[key][k];
                        }
                    }
                } else {
                    this.config[key] = configNew[key];
                }
            }
        }
    }

    clearElement = function(element: HTMLElement): void {
        while (element.children.length > 0) {
            element.removeChild(element.lastElementChild);
        }
    }

    getFigureBbox = function(): BBox {
        // get parent dims
        const parentWidth = parseInt(this.svg.parentElement.clientWidth);
        const parentHeight = parseInt(this.svg.parentElement.clientHeight);
        const minDim = Math.min(parentHeight, parentWidth);
    
        // get svg dims
        const p1 = /(?<perc>[0-9]+)%/
        const p2 = /(?<pxls>[0-9]+)px/                

        const marginPxls = {} as Margin;
        for (let m in this.config.margin) {
            if (this.config.margin[m].match(p1) !== null) {
                const perc: number = Math.min(
                    parseInt(this.config.margin[m].match(p1).groups['perc']),
                    50
                );
                marginPxls[m] = (minDim * perc / 100).toString();
            } else if (this.config.margin[m].match(p2) !== null) {
                marginPxls[m] = (this.config.margin[m].match(p2).groups['pxls']).toString();
            }
        }

        const bbox: BBox = {
            x1: parseInt(marginPxls.left), 
            y1: parseInt(marginPxls.top),
            x2: parentWidth - parseInt(marginPxls.right),
            y2: parentHeight - parseInt(marginPxls.bottom),
        };
        bbox.x1_inner = bbox.x1 + (bbox.x2 - bbox.x1) * 0.1;
        bbox.x2_inner = bbox.x2 - (bbox.x2 - bbox.x1) * 0.1;
        bbox.y1_inner = bbox.y1 + (bbox.y2 - bbox.y1) * 0.1;
        bbox.y2_inner = bbox.y2 - (bbox.y2 - bbox.y1) * 0.0; // !!!

        return bbox;
    }

    drawAxBox = function(): void {
        const rect = this.chart.append('rect');
        rect
            .attr('x', this.bbox.x1)
            .attr('y', this.bbox.y1)
            .attr('width', this.bbox.x2 - this.bbox.x1)
            .attr('height', this.bbox.y2 - this.bbox.y1);

        rect.style('fill', this.config.background);
        rect.style('stroke', this.config.background);
    }

    init = function(): void {
        if (this.clear) {
            this.clearElement(this.svg);
        }
        this.svg.style.backgroundColor = this.config.container;

        // get d3 chart
        const parent = this.svg.parentElement;
        this.chart
            .attr('width', parent.clientWidth)
            .attr('height', parent.clientHeight);

        // draw ax box
        if (this.clear) {
            this.drawAxBox();
        }
    }

    show = function(clear=true): void {
        this.clear = clear;
        this.init();
    }

    completeTrace = function(trace) {
        const traceNew = Object.assign({}, this.traceDefault);
        for (let key in trace) {
            if (key in traceNew) {
                if (typeof(traceNew[key]) === 'object' && key in trace) {
                    for (let k in trace[key]) {
                        if (k in traceNew[key]) {
                            traceNew[key][k] = trace[key][k];
                        }
                    }
                } else {
                    traceNew[key] = trace[key];
                }
            }
        }

        return traceNew;
    }

    addTrace = function(trace: Trace): void {
        // TODO: overwrite it to add validation
        const traceNew = this.completeTrace(trace);

        traceNew.idx = this.traces.length; 
        this.traces.push(traceNew);
    }
}