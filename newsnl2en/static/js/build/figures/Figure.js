const d3 = window["d3"]; // TODO: this should be imported!!!
export class Figure {
    constructor(svg, config) {
        this.updateConfig = function (configNew) {
            for (let key in this.config) {
                if (key in configNew) {
                    if (typeof (this.config[key]) === 'object') {
                        for (let k in this.config[key]) {
                            if (k in configNew[key]) {
                                this.config[key][k] = configNew[key][k];
                            }
                        }
                    }
                    else {
                        this.config[key] = configNew[key];
                    }
                }
            }
        };
        this.clearElement = function (element) {
            while (element.children.length > 0) {
                element.removeChild(element.lastElementChild);
            }
        };
        this.getFigureBbox = function () {
            // get parent dims
            const parentWidth = parseInt(this.svg.parentElement.clientWidth);
            const parentHeight = parseInt(this.svg.parentElement.clientHeight);
            const minDim = Math.min(parentHeight, parentWidth);
            // get svg dims
            const p1 = /(?<perc>[0-9]+)%/;
            const p2 = /(?<pxls>[0-9]+)px/;
            const marginPxls = {};
            for (let m in this.config.margin) {
                if (this.config.margin[m].match(p1) !== null) {
                    const perc = Math.min(parseInt(this.config.margin[m].match(p1).groups['perc']), 50);
                    marginPxls[m] = (minDim * perc / 100).toString();
                }
                else if (this.config.margin[m].match(p2) !== null) {
                    marginPxls[m] = (this.config.margin[m].match(p2).groups['pxls']).toString();
                }
            }
            const bbox = {
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
        };
        this.drawAxBox = function () {
            const rect = this.chart.append('rect');
            rect
                .attr('x', this.bbox.x1)
                .attr('y', this.bbox.y1)
                .attr('width', this.bbox.x2 - this.bbox.x1)
                .attr('height', this.bbox.y2 - this.bbox.y1);
            rect.style('fill', this.config.background);
            rect.style('stroke', this.config.background);
        };
        this.init = function () {
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
        };
        this.show = function (clear = true) {
            this.clear = clear;
            this.init();
        };
        this.completeTrace = function (trace) {
            const traceNew = Object.assign({}, this.traceDefault);
            for (let key in trace) {
                if (key in traceNew) {
                    if (typeof (traceNew[key]) === 'object' && key in trace) {
                        for (let k in trace[key]) {
                            if (k in traceNew[key]) {
                                traceNew[key][k] = trace[key][k];
                            }
                        }
                    }
                    else {
                        traceNew[key] = trace[key];
                    }
                }
            }
            return traceNew;
        };
        this.addTrace = function (trace) {
            // TODO: overwrite it to add validation
            const traceNew = this.completeTrace(trace);
            traceNew.idx = this.traces.length;
            this.traces.push(traceNew);
        };
        this.clear = true;
        this.svg = svg; // html element
        this.chart = d3.select(`#${svg.id}`);
        ; // d3 class
        // default config
        this.config = {
            backgroundColor: 'white',
            containerColor: '#eeeef7',
            margin: {
                top: '5%',
                bottom: '5%',
                left: '5%',
                right: '5%'
            },
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
            }
        };
        // update config
        this.updateConfig(config);
        this.bbox = this.getFigureBbox();
        this.traces = [];
    }
}
