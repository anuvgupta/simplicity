# test.py

def simplicity_test(test_func):
    def test_func_wrapper(client, request):
        print('TEST: ' + request.node.name)
        return test_func(client, request)
    return test_func_wrapper