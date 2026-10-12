using Shesha.Domain;
using Shesha.JsonLogic;
using Shesha.JsonLogic.Exceptions;
using Shesha.Testing.Fixtures;
using System;
using System.Threading.Tasks;
using Xunit;

namespace Shesha.Tests.JsonLogic
{
    /// <summary>
    /// JsonLogic2LinqConverter tests of null operands of and/or (e.g. optional filter items that can't be resolved on the client side)
    /// </summary>
    [Collection(SqlServerCollection.Name)]
    public class JsonLogic2LinqConverter_NullOperandTests : JsonLogic2LinqConverterBaseTests
    {
        public JsonLogic2LinqConverter_NullOperandTests(SqlServerFixture fixture) : base(fixture)
        {
        }

        private readonly string _and_withNullOperand_expression = @"{
  ""and"": [
    null,
    {
      ""=="": [
        {
          ""var"": ""FirstName""
        },
        ""Bob""
      ]
    }
  ]
}";

        [Fact]
        public void And_WithNullOperand_Convert()
        {
            var expression = ConvertToExpression<Person>(_and_withNullOperand_expression);
            Assert.Equal(@"ent => (ent.FirstName == ""Bob"")", expression?.ToInvariantString());
        }

        [Fact]
        public async Task And_WithNullOperand_FetchAsync()
        {
            var data = await TryFetchDataAsync<Person, Guid>(_and_withNullOperand_expression);
            Assert.NotNull(data);
        }

        private readonly string _or_withNullOperand_expression = @"{
  ""or"": [
    {
      ""=="": [
        {
          ""var"": ""FirstName""
        },
        ""Bob""
      ]
    },
    null,
    {
      ""=="": [
        {
          ""var"": ""LastName""
        },
        ""Smith""
      ]
    }
  ]
}";

        [Fact]
        public void Or_WithNullOperand_Convert()
        {
            var expression = ConvertToExpression<Person>(_or_withNullOperand_expression);
            Assert.Equal(@"ent => ((ent.FirstName == ""Bob"") OrElse (ent.LastName == ""Smith""))", expression?.ToInvariantString());
        }

        [Fact]
        public async Task Or_WithNullOperand_FetchAsync()
        {
            var data = await TryFetchDataAsync<Person, Guid>(_or_withNullOperand_expression);
            Assert.NotNull(data);
        }

        private readonly string _and_withAllNullOperands_expression = @"{
  ""and"": [
    null,
    null
  ]
}";

        [Fact]
        public void And_WithAllNullOperands_Convert_Throws()
        {
            Assert.Throws<JsonLogicParsingFailedException>(() => ConvertToExpression<Person>(_and_withAllNullOperands_expression));
        }

        private readonly string _or_withAllNullOperands_expression = @"{
  ""or"": [
    null,
    null
  ]
}";

        [Fact]
        public void Or_WithAllNullOperands_Convert_Throws()
        {
            Assert.Throws<JsonLogicParsingFailedException>(() => ConvertToExpression<Person>(_or_withAllNullOperands_expression));
        }
    }
}
