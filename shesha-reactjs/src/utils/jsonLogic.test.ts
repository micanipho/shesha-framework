import { convertJsonLogicNode, convertJsonLogicNodeSync, IJsonLogicConversionOptions, IJsonLogicConversionOptionsSync } from './jsonLogic';

type Converter = (jsonLogic: object, data: object) => Promise<object | null>;

const getOptions = (data: object): IJsonLogicConversionOptions & IJsonLogicConversionOptionsSync => ({
  argumentEvaluator: () => ({ handled: false }),
  mappings: [{ match: 'data', data }],
});

const converters: [string, Converter][] = [
  ['convertJsonLogicNode', (jsonLogic, data) => convertJsonLogicNode(jsonLogic, getOptions(data))],
  ['convertJsonLogicNodeSync', (jsonLogic, data) => Promise.resolve(convertJsonLogicNodeSync(jsonLogic, getOptions(data)))],
];

const optional = (expression: string): object => ({ evaluate: [{ expression, type: 'mustache', required: false }] });

const statusFilter = { '==': [{ var: 'status' }, optional('{{data.status}}')] };
const typeFilter = { '==': [{ var: 'type' }, optional('{{data.type}}')] };
const activeFilter = { '==': [{ var: 'isActive' }, true] };

describe.each(converters)('%s', (_name, convert) => {
  it('drops an unresolved optional operand of "and" instead of sending null', async () => {
    const result = await convert({ and: [statusFilter, activeFilter] }, {});
    expect(result).toEqual({ and: [activeFilter] });
  });

  it('drops an unresolved optional operand of "or" instead of sending null', async () => {
    const result = await convert({ or: [activeFilter, statusFilter] }, {});
    expect(result).toEqual({ or: [activeFilter] });
  });

  it('drops a nested "or" whose operands are all unresolved', async () => {
    const result = await convert({ and: [{ or: [statusFilter, typeFilter] }, activeFilter] }, {});
    expect(result).toEqual({ and: [activeFilter] });
  });

  it('returns null when every operand of "and" is unresolved', async () => {
    const result = await convert({ and: [statusFilter, typeFilter] }, {});
    expect(result).toBeNull();
  });

  it('keeps optional operands that resolve', async () => {
    const result = await convert({ and: [statusFilter, activeFilter] }, { status: 'draft' });
    expect(result).toEqual({ and: [{ '==': [{ var: 'status' }, 'draft'] }, activeFilter] });
  });

  it('keeps a literal null in comparison operators', async () => {
    const result = await convert({ and: [{ '==': [{ var: 'status' }, null] }, activeFilter] }, {});
    expect(result).toEqual({ and: [{ '==': [{ var: 'status' }, null] }, activeFilter] });
  });
});
