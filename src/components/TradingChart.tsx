/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  createChart,
  IChartApi,
  MouseEventParams,
  ColorType,
  LineStyle,
  ISeriesApi,
  CandlestickData as ChartCandleStick,
  Time as ChartTime,
  TickMarkType,
} from 'lightweight-charts';
import { useQuery } from '@apollo/client';
import { GET_TRADES } from '@/graphql/queries';
import {
  GetTradesQuery,
  TradeFragment,
  TradesPayload,
  TradeTimeInterval,
} from '@/graphql/__generated__/graphql';
import { Loader } from './ui/loader';
import moment from 'moment';
import classNames from 'classnames';

type TradeInterval = keyof Omit<TradesPayload['candleSticks'], '__typename'>;

type Props = {
  trades: TradesPayload['trades'];
  candleSticks: TradesPayload['candleSticks'];
  seriesType?: 'Candlestick' | 'Area';
  timeSeries?: TradeTimeInterval;
  onCursorMove?: (args: any) => void;
};

const VISIBLE_TIME_INTERVAL_OPTIONS: TradeInterval[] = [
  TradeTimeInterval.OneSecond,
  TradeTimeInterval.ThirtySeconds,
  TradeTimeInterval.OneMinute,
  TradeTimeInterval.FiveMinutes,
  TradeTimeInterval.FifteenMinutes,
];

const timeIntervalLabelMap: Record<TradeInterval, string> = {
  [TradeTimeInterval.OneSecond]: '1s',
  [TradeTimeInterval.ThirtySeconds]: '30s',
  [TradeTimeInterval.OneMinute]: '1m',
  [TradeTimeInterval.FiveMinutes]: '5m',
  [TradeTimeInterval.FifteenMinutes]: '15m',
  [TradeTimeInterval.ThirtyMinutes]: '30m',
  [TradeTimeInterval.OneHour]: '1h',
  [TradeTimeInterval.FourHours]: '4h',
  [TradeTimeInterval.OneDay]: '1d',
  [TradeTimeInterval.OneWeek]: '1w',
};

// default chart styles/config
const chartFonts = ['-apple-system', 'ui-sans-serif', 'system-ui', 'sans-serif'];
const chartHeight = 300;
const gridLineColor = '#E9E9E9';
const chartBorderColor = '#D3D3D3';
const timeSeriesTextColor = '#696969';
const priceTextColor = '#545454';
const defaultChartOptions = {
  layout: {
    textColor: timeSeriesTextColor,
    background: { type: ColorType.Solid, color: 'transparent' },
  },
  height: chartHeight,
  autoSize: true,
  grid: {
    vertLines: {
      visible: false,
    },
    horzLines: {
      color: gridLineColor,
      style: LineStyle.Solid,
      visible: true,
    },
  },
  fontFamily: chartFonts.join(','),
  rightPriceScale: {
    textColor: priceTextColor,
    borderColor: chartBorderColor,
  },
  timeScale: {
    borderColor: chartBorderColor,
  },
};

// area chart config
const areaChartOptions = {
  lineColor: '#26a69a',
  topColor: '#26a69a',
  bottomColor: 'rgba(255, 255, 255, 0.28)',
};

// candle stick config
const candleStickOptions = {
  upColor: '#26a69a',
  downColor: '#ef5350',
  borderVisible: false,
  wickUpColor: '#26a69a',
  wickDownColor: '#ef5350',
};

const ChartTypeButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      className={classNames(
        'bg-gray-100 px-2 py-[1px] text-sm rounded hover:bg-gray-200 transition-all',
        {
          'bg-gray-700 text-white hover:text-white hover:bg-gray-600': isActive,
        }
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

const TimeSeriesButton = ({
  timeSeries,
  isActive,
  onClick,
}: {
  timeSeries: TradeTimeInterval;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      className={classNames(
        'bg-gray-50 px-2 py-[1px] rounded transition-all uppercase text-xs uppercase tracking-wide',
        {
          'bg-gray-500 text-white hover:text-white hover:bg-gray-500': isActive,
          'hover:bg-gray-100': !isActive,
        }
      )}
      onClick={onClick}
    >
      {timeIntervalLabelMap[timeSeries as keyof typeof timeIntervalLabelMap]}
    </button>
  );
};

const ChartLegend = ({ symbol, candle }: { symbol?: string | null; candle: any }) => {
  if (!symbol) return null;
  return (
    <div className="bg-transparent absolute top-0 left-0 z-[9]">
      <p className="text-2xl text-gray-800">{symbol}</p>
      {candle && (
        <div className="flex gap-3 font-light text-xs text-gray-600">
          <p>
            <span className="font-[400] pr-1">O:</span>
            {candle?.open}
          </p>
          <p>
            <span className="font-[400] pr-1">H:</span>
            {candle?.high}
          </p>
          <p>
            <span className="font-[400] pr-1">L:</span>
            {candle?.low}
          </p>
          <p>
            <span className="font-[400] pr-1">C:</span>
            {candle?.close}
          </p>
        </div>
      )}
    </div>
  );
};

const DEFAULT_CHART_TYPE = 'Area';
const DEFAULT_TIME_INTERVAL = TradeTimeInterval.OneMinute;
const DEFAULT_LOCALE = 'en-US';

const Chart = ({
  trades = [],
  candleSticks,
  seriesType,
  timeSeries = DEFAULT_TIME_INTERVAL,
  onCursorMove,
}: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick' | 'Area'> | null>(null);

  const handleResize = () => {
    if (containerRef?.current && chartRef?.current) {
      chartRef?.current?.applyOptions({
        width: containerRef.current.clientWidth,
      });
    }
  };

  const handleChartCursorMove = (cursorEvent: MouseEventParams) => {
    const data = cursorEvent?.seriesData;
    const hasData = data && data?.size > 0;
    if (!hasData) {
      onCursorMove?.(null);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_seriesApi, candle] = data.entries().next().value;
      onCursorMove?.(candle);
    }
  };

  // function* getNextRealtimeUpdate(realtimeData) {
  //   for (const dataPoint of realtimeData) {
  //     yield dataPoint;
  //   }
  //   return null;
  // }
  // const streamingDataProvider = getNextRealtimeUpdate(data.realtimeUpdates);

  // const intervalID = setInterval(() => {
  //   const update = streamingDataProvider.next();
  //   if (update.done) {
  //     clearInterval(intervalID);
  //     return;
  //   }
  //   series.update(update.value);
  // }, 100);

  useLayoutEffect(() => {
    if (!containerRef?.current) return;
    const chart = createChart(containerRef?.current, defaultChartOptions);
    chartRef.current = chart;

    chart?.timeScale().fitContent();
    chart.applyOptions({
      timeScale: {
        timeVisible: true,
        tickMarkFormatter: (time: number, tickMarkType: TickMarkType) => {
          switch (tickMarkType) {
            case TickMarkType.Year:
              return moment(time * 1000)
                .local()
                .format('YYYY');
            case TickMarkType.Month:
              return moment(time * 1000)
                .local()
                .format('MMM');
            case TickMarkType.DayOfMonth:
              return moment(time * 1000)
                .local()
                .format('DD');
            case TickMarkType.Time:
              return moment(time * 1000)
                .local()
                .format('LT');
            default:
              return '';
          }
        },
      },
      localization: {
        locale: DEFAULT_LOCALE,
        timeFormatter: (time: number) => {
          const dateTime = new Date(time * 1000);
          return moment(dateTime).local().format('LLL');
        },
        dateFormat: 'yyyy-MM-dd',
      },
    });
    chart.subscribeCrosshairMove(handleChartCursorMove);

    window.addEventListener('resize', handleResize);
    return () => {
      // clearInterval(intervalID);
      window.removeEventListener('resize', handleResize);
      chart.unsubscribeCrosshairMove(handleChartCursorMove);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    // remove existing series if any
    // There is a weird bug where the chart is not removing the series - without catching it in a try/catch block
    // it throws an error and stops the execution of the code which is unecessary
    if (seriesRef?.current) {
      try {
        chart?.removeSeries(seriesRef?.current);
      } catch (e) {
        // no-op
      }
    }

    // add new series to chart
    switch (seriesType) {
      case 'Area': {
        const areaData = trades?.map((trade: TradeFragment) => ({
          time: moment(trade.timestamp).unix() as ChartTime,
          value: trade.price,
        }));
        seriesRef.current = chart?.addAreaSeries(areaChartOptions);
        seriesRef.current.setData(areaData);
        break;
      }
      case 'Candlestick': {
        const oneMinuteCandles =
          candleSticks[timeSeries as keyof typeof timeIntervalLabelMap] || [];
        // format db trade data for chart
        const candlesForChart = oneMinuteCandles?.map((candle) => ({
          time: new Date(candle.timestamp).getTime() / 1000,
          open: candle.open || undefined,
          high: candle.high || undefined,
          low: candle.low || undefined,
          close: candle.close || undefined,
        })) as ChartCandleStick[];

        seriesRef.current = chart?.addCandlestickSeries(candleStickOptions);
        // add candles to chart
        seriesRef.current.setData(candlesForChart);
        break;
      }
    }

    chart.timeScale().fitContent();
  }, [trades, candleSticks, seriesType, timeSeries]);

  return (
    <div
      style={{
        height: chartHeight,
        width: '100%',
      }}
      ref={containerRef}
    />
  );
};

const TradingChart = ({ symbol }: { symbol?: string | null }) => {
  const [hoveredCandle, setHoveredCandle] = useState<ChartCandleStick | null>(null);
  const [currentSeries, setCurrentSeries] = useState<'Candlestick' | 'Area'>(DEFAULT_CHART_TYPE);
  const [currentTimeSeries, setTimeSeries] = useState<TradeTimeInterval>(DEFAULT_TIME_INTERVAL);
  const {
    data: tradeData,
    loading: fetchingChartData,
    error,
  } = useQuery<GetTradesQuery>(GET_TRADES, {
    variables: {
      symbol,
    },
    skip: !symbol,
  });

  const handleCursorMove = (data: any) => {
    setHoveredCandle(data);
  };

  if (error) {
    return <p className="text-center">Error fetching chart data</p>;
  }

  return (
    <div className="relative">
      {!!tradeData?.getTrades && (
        <ChartLegend
          symbol={symbol}
          candle={currentSeries === 'Candlestick' ? hoveredCandle : null}
        />
      )}
      {fetchingChartData && (
        <div className="flex justify-center items-center">
          <Loader />
        </div>
      )}
      <Chart
        trades={tradeData?.getTrades?.trades as TradesPayload['trades']}
        candleSticks={tradeData?.getTrades?.candleSticks as TradesPayload['candleSticks']}
        seriesType={currentSeries}
        timeSeries={currentTimeSeries}
        onCursorMove={handleCursorMove}
      />
      {!!tradeData?.getTrades && (
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <ChartTypeButton
              label="Line"
              isActive={currentSeries === 'Area'}
              onClick={() => setCurrentSeries('Area')}
            />
            <ChartTypeButton
              label="Candle"
              isActive={currentSeries === 'Candlestick'}
              onClick={() => setCurrentSeries('Candlestick')}
            />
          </div>
          {currentSeries === 'Candlestick' && (
            <div className="flex items-center gap-2">
              {VISIBLE_TIME_INTERVAL_OPTIONS.map((timeSeries) => (
                <TimeSeriesButton
                  key={timeSeries}
                  timeSeries={timeSeries as TradeTimeInterval}
                  onClick={() => setTimeSeries(timeSeries as TradeTimeInterval)}
                  isActive={timeSeries === currentTimeSeries}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TradingChart;
